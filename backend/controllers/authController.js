import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { db } from '../storage/dataStore.js';
import { sendAdminOtpEmail } from '../services/emailService.js';

// In-memory store for pending 2FA verification sessions
// Stores ONLY hashed OTPs (HMAC-SHA256) - never plain OTP codes
const pending2FASessions = new Map();

// Periodic cleanup of expired pending 2FA sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of pending2FASessions.entries()) {
    if (now > session.expiresAt + 60000) {
      pending2FASessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

/**
 * Step 1: Administrator Login (Email + Password)
 * Validates credentials server-side, generates cryptographically secure 6-digit OTP,
 * hashes OTP, and dispatches email to configured admin Gmail address.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both User ID / Institutional Email and Password are required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    // 1. Check if email matches configured admin email or registered database administrator
    let matchedUser = null;
    let targetPasswordHash = null;

    if (cleanEmail === config.adminEmail) {
      matchedUser = {
        id: 'adm_super',
        email: config.adminEmail,
        name: 'School Administration',
        role: 'ADMIN',
        department: 'Senior Administration & Leadership'
      };
      targetPasswordHash = config.adminPasswordHash;
    } else {
      const dbUser = db.findAdminByEmail(cleanEmail);
      if (dbUser) {
        matchedUser = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role || 'ADMIN',
          department: dbUser.department || 'School Administration'
        };
        targetPasswordHash = dbUser.passwordHash;
      }
    }

    // Generic error on failure to prevent username enumeration
    if (!matchedUser || !targetPasswordHash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrative credentials. Please check your Email and Password.'
      });
    }

    // 2. Validate password securely using bcrypt
    const isPasswordValid = await bcrypt.compare(cleanPassword, targetPasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrative credentials. Please check your Email and Password.'
      });
    }

    // 3. Generate cryptographically secure 6-digit random numeric OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // 4. Store ONLY the hashed OTP (HMAC-SHA256)
    const otpHash = crypto.createHmac('sha256', config.jwtSecret).update(otpCode).digest('hex');
    const expiresAt = Date.now() + config.otpExpirySeconds * 1000;

    // Create a stateless signed JWT for tempSessionId so serverless environments like Vercel
    // never lose the session during function cold starts or across multiple instances
    const tempPayload = {
      type: '2fa_temp_session',
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      department: matchedUser.department,
      otpHash
    };
    const tempSessionId = jwt.sign(tempPayload, config.jwtSecret, {
      expiresIn: `${config.otpExpirySeconds}s`
    });

    pending2FASessions.set(tempSessionId, {
      ...tempPayload,
      expiresAt,
      attempts: 0,
      lastSentAt: Date.now()
    });

    // 5. Send OTP to the administrator's authorized Gmail address
    const emailResult = await sendAdminOtpEmail(matchedUser.email, otpCode);

    // 6. Respond with pending 2FA session metadata (never leak codes or master codes)
    return res.status(200).json({
      success: true,
      step: 'otp_required',
      message: `A 6-digit verification code has been dispatched to ${matchedUser.email}.`,
      tempSessionId,
      email: matchedUser.email,
      expiresIn: config.otpExpirySeconds,
      resendCooldown: 60,
      isSimulated: Boolean(emailResult.simulated)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2: Email OTP Verification
 * Verifies submitted 6-digit code against server-stored hash or master code.
 * Enforces expiration, attempts limit (brute-force defense),
 * and immediate invalidation upon successful verification.
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { tempSessionId, otp, code } = req.body;
    const inputOtp = (otp || code || '').toString().trim();

    if (!tempSessionId || !inputOtp) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and 6-digit verification code are required.'
      });
    }

    let session = pending2FASessions.get(tempSessionId);

    // If session is missing from in-memory Map (e.g. Vercel serverless cold start),
    // decode and verify the signed tempSessionId JWT token
    if (!session) {
      try {
        const decoded = jwt.verify(tempSessionId, config.jwtSecret);
        if (decoded && decoded.type === '2fa_temp_session') {
          session = {
            ...decoded,
            expiresAt: (decoded.exp || Math.floor(Date.now() / 1000) + 300) * 1000,
            attempts: 0
          };
          pending2FASessions.set(tempSessionId, session);
        }
      } catch (jwtErr) {
        return res.status(400).json({
          success: false,
          error: 'Verification session has expired or is invalid. Please sign in again.'
        });
      }
    }

    if (!session) {
      return res.status(400).json({
        success: false,
        error: 'Verification session expired or invalid. Please login again.'
      });
    }

    // 1. Check expiration (5 minutes)
    if (Date.now() > session.expiresAt) {
      pending2FASessions.delete(tempSessionId);
      return res.status(400).json({
        success: false,
        error: 'This verification code has expired. Please request a new code.'
      });
    }

    // 2. Brute-force protection: track attempts
    session.attempts = (session.attempts || 0) + 1;

    if (session.attempts > 8) {
      pending2FASessions.delete(tempSessionId);
      return res.status(429).json({
        success: false,
        error: 'Too many incorrect verification attempts. For security, this session has been locked. Please sign in again.'
      });
    }

    // 3. Timing-safe verification of the incoming OTP hash or explicitly configured Master Passcode
    const incomingHash = crypto.createHmac('sha256', config.jwtSecret).update(inputOtp).digest('hex');
    let isMasterCodeValid = false;
    if (config.master2faCode && config.master2faCode.length >= 6) {
      try {
        const inputHash = crypto.createHash('sha256').update(inputOtp).digest();
        const masterHash = crypto.createHash('sha256').update(config.master2faCode).digest();
        isMasterCodeValid = crypto.timingSafeEqual(inputHash, masterHash);
      } catch {
        isMasterCodeValid = false;
      }
    }

    let isOtpValid = false;
    if (session.otpHash) {
      try {
        isOtpValid = crypto.timingSafeEqual(
          Buffer.from(incomingHash, 'hex'),
          Buffer.from(session.otpHash, 'hex')
        );
      } catch {
        isOtpValid = false;
      }
    }

    if (!isOtpValid && !isMasterCodeValid) {
      const remainingAttempts = 8 - session.attempts;
      return res.status(401).json({
        success: false,
        error: remainingAttempts > 0
          ? `Invalid verification code. Please try again. (${remainingAttempts} attempts remaining)`
          : 'Invalid verification code. Please try again.'
      });
    }

    // 4. Verification successful: IMMEDIATELY purge pending OTP session
    pending2FASessions.delete(tempSessionId);

    // 5. Issue authenticated JWT session token
    const payload = {
      id: session.userId || 'adm_super',
      email: session.email || config.adminEmail,
      name: session.name || 'School Administration',
      role: session.role || 'ADMIN',
      department: session.department || 'Senior Administration & Leadership'
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication and two-step verification successful.',
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resend OTP Code
 * Generates a completely new 6-digit OTP, invalidates the previous code,
 * enforces a strict 60-second cooldown, and dispatches a new email.
 */
export const resendOtp = async (req, res, next) => {
  try {
    const { tempSessionId } = req.body;

    if (!tempSessionId) {
      return res.status(400).json({
        success: false,
        error: 'Verification session ID is required.'
      });
    }

    let session = pending2FASessions.get(tempSessionId);
    if (!session) {
      try {
        const decoded = jwt.verify(tempSessionId, config.jwtSecret);
        if (decoded && decoded.type === '2fa_temp_session') {
          session = {
            ...decoded,
            expiresAt: (decoded.exp || Math.floor(Date.now() / 1000) + 300) * 1000,
            attempts: 0,
            lastSentAt: 0
          };
        }
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Verification session expired. Please sign in again.'
        });
      }
    }

    if (!session) {
      return res.status(400).json({
        success: false,
        error: 'Verification session expired. Please sign in again.'
      });
    }

    // Enforce 60-second cooldown timer (only if lastSentAt was recorded)
    const elapsed = Date.now() - (session.lastSentAt || 0);
    const cooldownMs = 60 * 1000;

    if (session.lastSentAt && elapsed < cooldownMs) {
      const remainingSecs = Math.ceil((cooldownMs - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${remainingSecs} seconds before requesting a new verification code.`,
        retryAfter: remainingSecs
      });
    }

    // Generate completely new 6-digit OTP
    const newOtpCode = crypto.randomInt(100000, 1000000).toString();
    const newOtpHash = crypto.createHmac('sha256', config.jwtSecret).update(newOtpCode).digest('hex');

    const newPayload = {
      type: '2fa_temp_session',
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      department: session.department,
      otpHash: newOtpHash
    };

    const newTempSessionId = jwt.sign(newPayload, config.jwtSecret, {
      expiresIn: `${config.otpExpirySeconds}s`
    });

    pending2FASessions.set(newTempSessionId, {
      ...newPayload,
      expiresAt: Date.now() + config.otpExpirySeconds * 1000,
      attempts: 0,
      lastSentAt: Date.now()
    });

    // Dispatch email with fresh OTP
    const emailResult = await sendAdminOtpEmail(session.email, newOtpCode);

    return res.status(200).json({
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${session.email}.`,
      tempSessionId: newTempSessionId,
      expiresIn: config.otpExpirySeconds,
      resendCooldown: 60,
      isSimulated: Boolean(emailResult.simulated)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get active authenticated session profile
 */
export const getSession = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logout administrator
 */
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// Aliases for backward compatibility
export const verify2FA = verifyOtp;
export const getMe = getSession;

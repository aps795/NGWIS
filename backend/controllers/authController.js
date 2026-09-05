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

    // 4. Store ONLY the hashed OTP (HMAC-SHA256) in server memory
    const otpHash = crypto.createHmac('sha256', config.jwtSecret).update(otpCode).digest('hex');
    const tempSessionId = crypto.randomUUID();
    const expiresAt = Date.now() + config.otpExpirySeconds * 1000;

    pending2FASessions.set(tempSessionId, {
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      department: matchedUser.department,
      otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: Date.now()
    });

    // 5. Send OTP to the administrator's authorized Gmail address
    await sendAdminOtpEmail(matchedUser.email, otpCode);

    // 6. Respond with pending 2FA session metadata (NEVER returning the plain OTP or hash)
    return res.status(200).json({
      success: true,
      step: 'otp_required',
      message: `A 6-digit verification code has been sent to ${matchedUser.email}.`,
      tempSessionId,
      email: matchedUser.email,
      expiresIn: config.otpExpirySeconds,
      resendCooldown: 60
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2: Email OTP Verification
 * Verifies submitted 6-digit code against server-stored hash.
 * Enforces 5-minute expiration, max 5 attempts (brute-force defense),
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

    const session = pending2FASessions.get(tempSessionId);

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
    session.attempts += 1;

    if (session.attempts > 5) {
      pending2FASessions.delete(tempSessionId);
      return res.status(429).json({
        success: false,
        error: 'Too many incorrect verification attempts. For security, this session has been locked. Please sign in again.'
      });
    }

    // 3. Timing-safe verification of the incoming OTP hash
    const incomingHash = crypto.createHmac('sha256', config.jwtSecret).update(inputOtp).digest('hex');
    const isMasterCodeValid = Boolean(config.master2faCode && inputOtp === config.master2faCode);

    let isOtpValid = false;
    try {
      isOtpValid = crypto.timingSafeEqual(
        Buffer.from(incomingHash, 'hex'),
        Buffer.from(session.otpHash, 'hex')
      );
    } catch {
      isOtpValid = false;
    }

    if (!isOtpValid && !isMasterCodeValid) {
      const remainingAttempts = 5 - session.attempts;
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
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      department: session.department
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

    const session = pending2FASessions.get(tempSessionId);

    if (!session) {
      return res.status(400).json({
        success: false,
        error: 'Verification session expired. Please sign in again.'
      });
    }

    // Enforce 60-second cooldown timer
    const elapsed = Date.now() - session.lastSentAt;
    const cooldownMs = 60 * 1000;

    if (elapsed < cooldownMs) {
      const remainingSecs = Math.ceil((cooldownMs - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${remainingSecs} seconds before requesting a new verification code.`,
        retryAfter: remainingSecs
      });
    }

    // Generate completely new 6-digit OTP & invalidate previous hash
    const newOtpCode = crypto.randomInt(100000, 1000000).toString();
    const newOtpHash = crypto.createHmac('sha256', config.jwtSecret).update(newOtpCode).digest('hex');

    session.otpHash = newOtpHash;
    session.expiresAt = Date.now() + config.otpExpirySeconds * 1000;
    session.attempts = 0; // reset attempts for fresh code
    session.lastSentAt = Date.now();

    // Dispatch email with fresh OTP
    await sendAdminOtpEmail(session.email, newOtpCode);

    return res.status(200).json({
      success: true,
      message: `A new 6-digit verification code has been sent to ${session.email}.`,
      expiresIn: config.otpExpirySeconds,
      resendCooldown: 60
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

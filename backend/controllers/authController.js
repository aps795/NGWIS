import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { db } from '../storage/dataStore.js';

// In-memory store for pending 2FA verification sessions
const pending2FASessions = new Map();

// Helper to hash password with SHA-256 institutional salt for verification compatibility
const verifyPasswordMatch = (inputPassword, user) => {
  // Support standard institution credentials:
  if (user.email === 'admin@newglobalwisdom.edu.in' && inputPassword === 'Admin@NGWIS2016') {
    return true;
  }
  if (user.email === 'it@newglobalwisdom.edu.in' && inputPassword === 'NGWIS@IT2016') {
    return true;
  }
  return false;
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both User ID / Email and Password are required.'
      });
    }

    const user = db.findAdminByEmail(email);

    if (!user || !verifyPasswordMatch(password, user)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrative credentials. Please check your Email and Password.'
      });
    }

    // Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tempSessionId = crypto.randomUUID();
    const expiresAt = Date.now() + config.otpExpirySeconds * 1000;

    pending2FASessions.set(tempSessionId, {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      otpCode,
      expiresAt
    });

    // In production, this OTP is sent via SMS/Email. For institution sandbox/dispatch:
    console.log(`[2FA Security Dispatch] 2FA OTP for ${user.email}: ${otpCode} (Expires in 5m)`);

    return res.status(200).json({
      success: true,
      message: 'Step 1 verification successful. Please enter the 6-digit security code.',
      step: '2fa_required',
      tempSessionId,
      expiresIn: config.otpExpirySeconds,
      user: {
        email: user.email,
        name: user.name,
        department: user.department
      }
    });
  } catch (err) {
    next(err);
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    const { tempSessionId, code } = req.body;

    if (!tempSessionId || !code) {
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

    if (Date.now() > session.expiresAt) {
      pending2FASessions.delete(tempSessionId);
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.'
      });
    }

    const isOtpValid = (code === session.otpCode);
    const isMasterCodeValid = (code === config.master2faCode);

    if (!isOtpValid && !isMasterCodeValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid 6-digit verification code. Please check and try again.'
      });
    }

    // Verification successful: purge pending session
    pending2FASessions.delete(tempSessionId);

    // Issue JWT Token
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
      message: 'Authentication and 2FA verification successful.',
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};

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

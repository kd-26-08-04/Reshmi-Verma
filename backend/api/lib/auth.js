/**
 * Authentication and Security Helper for HealthwithReshmi™
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'reshmi-verma-clinical-wellness-secret-jwt-key-2026';
const JWT_EXPIRES_IN = '7d';

export const auth = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async comparePassword(plain, hashed) {
    if (!plain || !hashed) return false;
    return await bcrypt.compare(plain, hashed);
  },

  generateToken(user) {
    const payload = {
      userId: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'client'
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verifyToken(token) {
    if (!token) return null;
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  getUserFromRequest(req) {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers?.cookie) {
      const match = req.headers.cookie.match(/token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) return null;
    return this.verifyToken(token);
  },

  isAdmin(user) {
    if (!user) return false;
    const adminEmails = [
      (process.env.VITE_CLINIC_EMAIL || '').toLowerCase().trim(),
      'support.reshmiverma@gmail.com',
      'consult@reshmiverma.com',
      'admin@reshmiverma.com'
    ];
    return user.role === 'admin' || adminEmails.includes((user.email || '').toLowerCase().trim());
  }
};

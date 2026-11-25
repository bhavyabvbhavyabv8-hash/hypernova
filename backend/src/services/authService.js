import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { sessionCookieName } from '../middleware/authenticate.js'
import { HttpError } from '../utils/httpError.js'

const sessionMaxAge = 7 * 24 * 60 * 60 * 1000

export function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

export function setSessionCookie(res, user) {
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new HttpError(503, 'Authentication is not configured. Set a JWT_SECRET of at least 32 characters.')
  }

  const token = jwt.sign(
    { email: user.email },
    config.jwtSecret,
    { subject: String(user.id), expiresIn: '7d' },
  )

  res.cookie(sessionCookieName, token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api',
    maxAge: sessionMaxAge,
  })
}

export const clearSessionCookie = (res) => {
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/api',
  })
}

export function safeUser(user) {
  return {
    id: String(user.id),
    email: user.email,
    displayName: user.display_name,
  }
}

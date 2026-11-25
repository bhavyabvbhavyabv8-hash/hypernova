import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

export const sessionCookieName = 'flocci_session'

export function requireAuth(req, _res, next) {
  if (!config.jwtSecret) {
    return next(new HttpError(503, 'Authentication is not configured. Set JWT_SECRET in .env.'))
  }

  const token = req.cookies?.[sessionCookieName]
  if (!token) {
    return next(new HttpError(401, 'Please sign in to continue.'))
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (typeof payload === 'string' || !payload.sub) {
      return next(new HttpError(401, 'Your session is invalid. Please sign in again.'))
    }

    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(new HttpError(401, 'Your session has expired. Please sign in again.'))
  }
}

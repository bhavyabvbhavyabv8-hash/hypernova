import { database } from '../db/pool.js'
import { clearSessionCookie, hashPassword, safeUser, setSessionCookie, verifyPassword } from '../services/authService.js'
import { HttpError } from '../utils/httpError.js'

function getDatabase(req) {
  return req.app.locals.database || database
}

export async function register(req, res) {
  const { email, displayName, password } = req.validatedBody
  const passwordHash = await hashPassword(password)

  try {
    const result = await getDatabase(req).query(
      `INSERT INTO users (email, display_name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name`,
      [email, displayName, passwordHash],
    )
    const user = result.rows[0]
    setSessionCookie(res, user)
    res.status(201).json({ user: safeUser(user) })
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'An account with this email already exists.')
    }
    throw error
  }
}

export async function login(req, res) {
  const { email, password } = req.validatedBody
  const result = await getDatabase(req).query(
    'SELECT id, email, display_name, password_hash FROM users WHERE email = $1',
    [email],
  )
  const user = result.rows[0]

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new HttpError(401, 'Email or password is incorrect.')
  }

  setSessionCookie(res, user)
  res.json({ user: safeUser(user) })
}

export async function logout(_req, res) {
  clearSessionCookie(res)
  res.status(204).end()
}

export async function getCurrentUser(req, res) {
  const result = await getDatabase(req).query(
    'SELECT id, email, display_name FROM users WHERE id = $1',
    [req.user.id],
  )
  if (!result.rows[0]) {
    clearSessionCookie(res)
    throw new HttpError(401, 'Your account no longer exists. Please sign in again.')
  }
  res.json({ user: safeUser(result.rows[0]) })
}

import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getCurrentUser, login, logout, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authenticate.js'
import { validateBody } from '../middleware/validate.js'
import { loginBody, registerBody } from '../validators/schemas.js'

const router = Router()
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/register', authRateLimit, validateBody(registerBody), register)
router.post('/login', authRateLimit, validateBody(loginBody), login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, getCurrentUser)

export default router

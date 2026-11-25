import { Router } from 'express'
import { getDatabaseHealth, getHealth } from '../controllers/healthController.js'

const router = Router()

router.get('/health', getHealth)
router.get('/health/db', getDatabaseHealth)
router.get('/db-health', getDatabaseHealth)

export default router

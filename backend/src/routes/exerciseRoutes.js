import { Router } from 'express'
import { createExercise, listExercises } from '../controllers/exerciseController.js'
import { requireAuth } from '../middleware/authenticate.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { exerciseBody, exerciseQuery } from '../validators/schemas.js'

const router = Router()

router.use(requireAuth)
router.get('/', validateQuery(exerciseQuery), listExercises)
router.post('/', validateBody(exerciseBody), createExercise)

export default router

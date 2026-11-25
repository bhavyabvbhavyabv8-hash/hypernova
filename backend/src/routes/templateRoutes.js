import { Router } from 'express'
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
} from '../controllers/templateController.js'
import { requireAuth } from '../middleware/authenticate.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { idParams, templateBody } from '../validators/schemas.js'

const router = Router()

router.use(requireAuth)
router.get('/', listTemplates)
router.post('/', validateBody(templateBody), createTemplate)
router.get('/:id', validateParams(idParams), getTemplate)
router.put('/:id', validateParams(idParams), validateBody(templateBody), updateTemplate)
router.delete('/:id', validateParams(idParams), deleteTemplate)

export default router

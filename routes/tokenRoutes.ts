import { Router } from 'express'
import { getAllTokens, getTokenById } from '.././controllers/tokenController'

const router = Router()

router.get('/tokens', getAllTokens)
router.get('/tokens/:id', getTokenById)

export default router

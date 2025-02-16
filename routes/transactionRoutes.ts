import { Router } from 'express'
import { getTokenTransactionByTokenId } from '../controllers/transactionController'

const router = Router()

router.get('/transactions/:tokenId', getTokenTransactionByTokenId)

export default router

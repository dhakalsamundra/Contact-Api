import express from 'express'

import { resetPasswordRequest, resetPassword} from '../controllers/resetPassword'

const router = express.Router()

router.post('/', resetPasswordRequest)
router.post('/:token', resetPassword)

export default router
import express from 'express'

import { passwordRequestReset, resetPasswordTokenStatus, resetPassword} from '../controllers/resetPassword'

const router = express.Router()

router.post('/', passwordRequestReset)
router.get('/:token', resetPasswordTokenStatus)
router.post('/:token', resetPassword)

export default router
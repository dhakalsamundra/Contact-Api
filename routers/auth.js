import express from 'express'
import { check} from 'express-validator'
import authJwt from '../middleware/auth'
import
 { findUserById, signIn,} 
 from '../controllers/auth'

const router = express.Router()

router.get('/', authJwt, findUserById)
router.post('/',
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
signIn)
// router.post('/forgetPassword', authJwt, passwordRequestReset)
// router.get('/resetPasswordRequest/:token', resetPasswordTokenStatus)
// router.post('/resetPasswordRequest/:token', resetPassword)

export default router
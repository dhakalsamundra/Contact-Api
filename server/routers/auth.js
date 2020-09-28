import express from 'express'
import { check} from 'express-validator'
import authJwt from '../middleware/auth'
import
 { findUserById, signIn} 
 from '../controllers/auth'

const router = express.Router()

router.get('/', authJwt, findUserById)
router.post('/',
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
signIn)

export default router
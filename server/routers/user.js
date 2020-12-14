import express from 'express'

import { signUpUser } from '../controllers/user'

const router = express.Router()

router.post('/', signUpUser)

export default router
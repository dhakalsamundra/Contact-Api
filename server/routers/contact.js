import express from 'express'

import authJwt from '../middleware/auth'
import { findContact, addContact, updateContact, deleteContact } from '../controllers/contact'

const router = express.Router()

router.get('/', authJwt, findContact)
router.post('/', authJwt, addContact)
router.put('/:id', authJwt, updateContact)
router.delete('/:id', authJwt, deleteContact)

export default router
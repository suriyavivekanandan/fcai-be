import express from 'express'

import auth from './auth'
import v1 from './v1/index'

const router = express.Router()

router.use('/auth', auth)
router.use('/v1', v1)

export default router

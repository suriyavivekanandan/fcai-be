import express from 'express'

import bookingRoutes from './booking.routes'
const router = express.Router()


router.use('/booking', bookingRoutes)
export default router

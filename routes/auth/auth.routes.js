import express from 'express'

import * as ctrl from '@/controllers'
import * as middleware from '@/middlewares'


const router = express.Router()


router.route('/register').post(ctrl.auth.authController.registerUser)
router.route('/verify-otp').post(ctrl.auth.authController.verifyOtp)
router.route('/refresh-token').get(
    middleware.verifyJWT, 
    ctrl.auth.authController.generateRefeshToken
);

router.route('/login').post(ctrl.auth.authController.loginUser)



router.route('/refresh-token').get(middleware.verifyJWT, ctrl.auth.authController.generateRefeshToken)

router.route("/logout").post(middleware.verifyJWT, ctrl.auth.authController.logoutUser);






export default router

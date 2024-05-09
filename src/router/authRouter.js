const express = require('express')
const app = express()
const controller = require('../controller/auth')
const {validateLogin,userSighUp, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const { userRegister, otpVerifyFn, login, changePassword, forgetPasswordSendOtpFn, forgetPasswordFn, getUserProfileFn, resendOtpFn, generateAuthToken } = require('../controller/auth/authController')
const uploads = require('../helper/fileUpload').upload

//==============================Authentication router============================================================================
app.post('/generateAuthToken',generateAuthToken)
app.post('/resendOtp',authenticateToken, resendOtpFn)
app.post('/otpVerify',authenticateToken, otpVerifyFn)
app.post('/sighUp',authenticateToken,userSighUp, handleValidationErrors,userRegister)
app.post('/login', validateLogin, handleValidationErrors, login)
app.post('/changePassword', authenticateToken, changePassword)
app.post('/forgetPasswordSendOtp', forgetPasswordSendOtpFn)
app.post('/forgetPasswordFn', forgetPasswordFn)
app.get('/getUserProfile', authenticateToken, getUserProfileFn)

module.exports=app
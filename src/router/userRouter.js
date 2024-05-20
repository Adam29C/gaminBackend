const express = require('express')
const app = express()
const controller = require('../controller/user')
const {validateLogin,userSighUp, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const uploads = require('../helper/fileUpload').upload
const{depositFn, withdrawalCreatePassword, withdraw, gamesList, seriesList, matchList, viewWallet, withdrawPayment, viewPaymentHistory, withdrawalPasswordSendOtp,withdrawalPasswordVerifyOtp,addAccountDetail, userAccountDetail, deleteAccountDetail}=require("../controller/user/userDashboard")
//==============================User Dashboard Router============================================================================
app.post('/deposit', authenticateToken,uploads, depositFn)
app.post('/addAccountDetail', authenticateToken,addAccountDetail)
app.get('/userAccountDetail', authenticateToken,userAccountDetail)
app.delete('/deleteAccountDetail', authenticateToken,deleteAccountDetail)
app.post('/generateWithdrawalPassword', authenticateToken,withdrawalCreatePassword)
app.post('/withdrawalPasswordSendOtp', authenticateToken,withdrawalPasswordSendOtp)
app.put('/withdrawalPasswordVerifyOtp', authenticateToken,withdrawalPasswordVerifyOtp)
app.post('/withdrawal', authenticateToken,withdraw)
app.get('/gameList', authenticateToken,gamesList)
app.get('/seriesList',authenticateToken,seriesList)
app.get('/matchList',authenticateToken,matchList)
app.get('/viewWallet',authenticateToken,viewWallet)
app.post('/withdrawPayment',authenticateToken,withdrawPayment)
app.get('/viewPaymentHistory',authenticateToken,viewPaymentHistory)

module.exports=app
const express = require('express')
const app = express()
const controller = require('../controller/user')
const {validateLogin,userSighUp, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
// const getMulterStorage = require('../helper/fileUpload')
const{depositFn, withdrawalCreatePassword, withdraw, gamesList, seriesList, matchList, viewWallet, withdrawPayment, viewPaymentHistory, withdrawalPasswordSendOtp,withdrawalPasswordVerifyOtp,addAccountDetail, userAccountDetail, deleteAccountDetail,addCreditRequest,filterPaymentHistory}=require("../controller/user/userDashboard")
const {getRules } = require('../controller/admin/adminDashboard')



// const financeInfo = getMulterStorage("uploads/financeInfo");


//==============================User Dashboard Router============================================================================
// app.post('/deposit', authenticateToken,financeInfo.single("image"), depositFn);
app.post('/addAccountDetail', authenticateToken,addAccountDetail)
app.get('/userAccountDetail', authenticateToken,userAccountDetail)
app.delete('/deleteAccountDetail', authenticateToken,deleteAccountDetail)
app.post('/generateWithdrawalPassword', authenticateToken,withdrawalCreatePassword)
app.post('/withdrawalPasswordSendOtp', authenticateToken,withdrawalPasswordSendOtp)
app.put('/withdrawalPasswordVerifyOtp', authenticateToken,withdrawalPasswordVerifyOtp)
// app.post('/withdrawal', authenticateToken,withdraw)
app.get('/gameList', authenticateToken,gamesList)
app.get('/seriesList',authenticateToken,seriesList)
app.get('/matchList',authenticateToken,matchList)
app.get('/viewWallet',authenticateToken,viewWallet)
app.post('/withdrawPayment',authenticateToken,withdrawPayment)
app.post('/addCreditRequest',authenticateToken,addCreditRequest)
app.get('/viewPaymentHistory',authenticateToken,viewPaymentHistory)
app.get('/filterPaymentHistory',authenticateToken,filterPaymentHistory)
app.get('/getRules', authenticateToken, getRules)


module.exports=app
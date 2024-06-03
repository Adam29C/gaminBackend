const express = require('express')
const app = express()
const controller = require('../controller/user')
const {validateLogin,userSighUp, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const{withdrawalCreatePassword, withdraw, gamesList, seriesList, matchList, viewWallet, withdrawPayment, viewPaymentHistory, withdrawalPasswordSendOtp,withdrawalPasswordVerifyOtp,addAccountDetail, userAccountDetail, deleteAccountDetail,addCreditRequest,filterPaymentHistory,accountById, adminAccountsList}=require("../controller/user/userDashboard")
const {getRules } = require('../controller/admin/adminDashboard')
const  getMulterStorage = require("../helper/fileUpload")

const paymentRequestImage = getMulterStorage("uploads/paymentRequest");

//==============================User Dashboard Router============================================================================
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
app.post('/addCreditRequest',authenticateToken,paymentRequestImage.single("image"),addCreditRequest);
app.get('/viewPaymentHistory',authenticateToken,viewPaymentHistory)
app.post('/filterPaymentHistory',filterPaymentHistory)
app.get('/getRules', authenticateToken, getRules)

//game By id 
app.get('/adminAccountsList',authenticateToken,adminAccountsList)
app.post('/accountById',authenticateToken,accountById)

module.exports=app
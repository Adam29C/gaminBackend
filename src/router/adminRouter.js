var express = require('express')
var app = express()
const controller = require('../controller/admin')
const { subAdminCreateValidate, validateLogin, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const { createSubAdminFn,gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, addAmount, paymentHistory, addRules, updateRules, deleteRules, getRules, updateRulesStatus, addAdminAccountDetail, subAdminList, adminAccountsList, deleteAdminAccountDetail, updateAdminAccountDetail, deleteSubAdmin, updateGameStatus, userList, countDashboard, deactivateUser, updatePaymentRequestStatus, transectionAndBankingList } = require('../controller/admin/adminDashboard')
const  getMulterStorage = require("../helper/fileUpload")

const adminFinanceDetails = getMulterStorage("uploads/adminFinanceDetails");
//==============================Admin Dashboard============================================================================
app.post('/createSubAdmin', authenticateToken, subAdminCreateValidate, handleValidationErrors, createSubAdminFn)
app.get('/subAdminList', authenticateToken, subAdminList);
app.get('/userList', authenticateToken, userList);
app.post('/gamesCreatedByAdmin', authenticateToken, gamesCreatedByAdmin)
app.put('/gamesUpdatedByAdmin', authenticateToken, gamesUpdatedByAdmin)
app.patch('/updateGameStatus',authenticateToken,updateGameStatus)
app.delete('/gameDeletedByAdmin', authenticateToken, gamesDeletedByAdmin)
app.post('/addAmount', authenticateToken, addAmount)
app.post('/paymentHistory', authenticateToken, paymentHistory)
app.post('/addRules', authenticateToken, addRules)
app.patch('/updateRules', authenticateToken, updateRules)
app.patch('/updateRulesStatus', authenticateToken, updateRulesStatus)
app.delete('/deleteRules', authenticateToken, deleteRules)
app.get('/getRules', authenticateToken, getRules);
app.post('/addAdminAccountDetail', authenticateToken,adminFinanceDetails.single("image"), addAdminAccountDetail)
app.get('/adminAccountsList', authenticateToken, adminAccountsList);
app.delete('/deleteAdminAccountDetail', authenticateToken, deleteAdminAccountDetail)
app.put('/updateAdminAccountDetail', authenticateToken,adminFinanceDetails.single("image"), updateAdminAccountDetail)
app.delete('/deleteSubAdmin', authenticateToken,deleteSubAdmin)
app.get('/countDashboard', authenticateToken, countDashboard);
app.patch('/deactivateUser',authenticateToken,deactivateUser)
app.put('/updatePaymentRequestStatus',authenticateToken,updatePaymentRequestStatus)
app.post("/transectionAndBankingList",authenticateToken,transectionAndBankingList)

 
module.exports = app
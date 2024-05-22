var express = require('express')
var app = express()
const controller = require('../controller/admin')
const { subAdminCreateValidate, validateLogin, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const { createSubAdminFn, userAndSubAdminList, usersCreatedBySubAdmin, gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, addAmount, paymentHistory, addRules, updateRules, deleteRules, getRules, updateRulesStatus, addAdminAccountDetail } = require('../controller/admin/adminDashboard')
const { getMulterStorage } = require("../helper/fileUpload")

const adminFinanceDetails = getMulterStorage("uploads/adminFinanceDetails");

//==============================Admin Dashboard============================================================================
app.post('/createSubAdmin', authenticateToken, subAdminCreateValidate, handleValidationErrors, createSubAdminFn)
app.get('/listOfUserAndSubAdmin', authenticateToken, userAndSubAdminList)
app.get('/listOfSubAdminUsers', authenticateToken, usersCreatedBySubAdmin)
app.post('/gamesCreatedByAdmin', authenticateToken, gamesCreatedByAdmin)
app.put('/gamesUpdatedByAdmin', authenticateToken, gamesUpdatedByAdmin)
app.delete('/gameDeletedByAdmin', authenticateToken, gamesDeletedByAdmin)
app.post('/addAmount', authenticateToken, addAmount)
app.get('/paymentHistory', authenticateToken, paymentHistory)
app.post('/addRules', authenticateToken, addRules)
app.patch('/updateRules', authenticateToken, updateRules)
app.patch('/updateRulesStatus', authenticateToken, updateRulesStatus)
app.delete('/deleteRules', authenticateToken, deleteRules)
app.get('/getRules', authenticateToken, getRules)
app.post('/addAdminAccountDetail', authenticateToken, adminFinanceDetails.single("image"), addAdminAccountDetail)
module.exports = app
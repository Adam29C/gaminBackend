var express = require('express')
var app = express()
const controller = require('../controller/subAdmin')
const { userSighUp, validateLogin, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const { userRegisterBySubAdmin, gamesCreatedBySubAdmin, gamesUpdatedSubAdmin, gameDeletedBySubAdmin, gamesList, updateSubAdminProfileFn, getSubAdminProfileFn, subAdminPermissions, subAdminUserList, deleteSubAdminUser, countDashboardUser } = require('../controller/subAdmin/subAdminDashboard')


//==============================SubAdmin Dashboard Router============================================================================
app.post('/userCreatedBySubAdmin', authenticateToken, userSighUp, handleValidationErrors, userRegisterBySubAdmin)
app.get('/subAdminUserList',authenticateToken,subAdminUserList)
app.get('/countDashboardUser',authenticateToken,countDashboardUser)
app.post('/gamesCreatedBySubAdmin',authenticateToken,gamesCreatedBySubAdmin)
app.get('/subAdminPermissions',authenticateToken,subAdminPermissions)
app.put('/gamesUpdatedSubAdmin',authenticateToken,gamesUpdatedSubAdmin)
app.delete('/gameDeletedBySubAdmin',authenticateToken,gameDeletedBySubAdmin)
app.get('/gameList',authenticateToken,gamesList)
app.get('/getSubAdminProfile',authenticateToken,getSubAdminProfileFn)
app.put('/updateSubAdminProfile',authenticateToken,updateSubAdminProfileFn)
app.delete('/deleteSubAdminUser', authenticateToken,deleteSubAdminUser)
// app.get('/viewPaymentHistory',authenticateToken,viewPaymentHistory)
 
module.exports = app
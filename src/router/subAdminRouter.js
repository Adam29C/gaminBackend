var express = require('express')
var app = express()
const controller = require('../controller/subAdmin')
const { userSighUp, validateLogin, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')

//==============================SubAdmin Dashboard Router============================================================================
app.post('/userCreatedBySubAdmin', authenticateToken, userSighUp, handleValidationErrors, controller.subAdminDashboard.userRegisterBySubAdmin)
app.post('/gamesCreatedBySubAdmin',authenticateToken,controller.subAdminDashboard.gamesCreatedBySubAdmin)
app.put('/gamesUpdatedSubAdmin',authenticateToken,controller.subAdminDashboard.gamesUpdatedSubAdmin)
app.delete('/gameDeletedBySubAdmin',authenticateToken,controller.subAdminDashboard.gameDeletedBySubAdmin)
app.get('/gameList',authenticateToken,controller.subAdminDashboard.gamesList)
app.get('/getSubAdminProfile',authenticateToken,controller.subAdminDashboard.getSubAdminProfileFn)
app.put('/updateSubAdminProfile',authenticateToken,controller.subAdminDashboard.updateSubAdminProfileFn)
 
module.exports = app
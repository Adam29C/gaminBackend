var express = require('express')
var app = express()
const controller = require('../controller/admin')
const { subAdminCreateValidate, validateLogin, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const { createSubAdminFn, userAndSubAdminList, usersCreatedBySubAdmin, gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, gamesList, addAmount } = require('../controller/admin/adminDashboard')

//==============================Admin Dashboard============================================================================
app.post('/createSubAdmin', authenticateToken, subAdminCreateValidate, handleValidationErrors, createSubAdminFn)
app.get('/listOfUserAndSubAdmin', authenticateToken, userAndSubAdminList)
app.get('/listOfSubAdminUsers', authenticateToken, usersCreatedBySubAdmin)
app.post('/gamesCreatedByAdmin', authenticateToken, gamesCreatedByAdmin)
app.put('/gamesUpdatedByAdmin', authenticateToken, gamesUpdatedByAdmin)
app.delete('/gameDeletedByAdmin', authenticateToken, gamesDeletedByAdmin)
app.get('/gameList', authenticateToken, gamesList)
app.post('/addAmount', authenticateToken, addAmount)

module.exports = app
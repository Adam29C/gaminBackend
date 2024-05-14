const express = require('express')
const app = express()
const controller = require('../controller/user')
const {validateLogin,userSighUp, handleValidationErrors } = require('../helper/validation')
const { authenticateToken } = require('../helper/middleware')
const uploads = require('../helper/fileUpload').upload

//==============================User Dashboard Router============================================================================
app.post('/deposit', authenticateToken,uploads, controller.userDashboard.depositFn)
app.post('/generateWithdrawalPassword', authenticateToken, controller.userDashboard.withdrawalCreatePassword)
app.post('/withdrawal', authenticateToken, controller.userDashboard.withdraw)
app.get('/gameList', authenticateToken,controller.userDashboard.gamesList)
app.get('/seriesList',authenticateToken,controller.userDashboard.seriesList)
app.get('/matchList',authenticateToken,controller.userDashboard.matchList)
app.get('/viewWallet',authenticateToken,controller.userDashboard.viewWallet)


module.exports=app
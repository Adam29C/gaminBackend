const express = require('express')
const app = express()
const {getRules,gamesList,checkToken}=require("../controller/admin/adminDashboard")
const { authenticateToken } = require('../helper/middleware')
//==============================Authentication router============================================================================

app.get('/getRules', authenticateToken, getRules )
app.get('/gamesList', authenticateToken,gamesList )
app.post('/checkToken',checkToken)
module.exports=app
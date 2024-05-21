const express = require('express')
const app = express()
const {getRules}=require("../controller/admin/adminDashboard")
const { authenticateToken } = require('../helper/middleware')
//==============================Authentication router============================================================================

app.get('/getRules', authenticateToken, getRules )

module.exports=app
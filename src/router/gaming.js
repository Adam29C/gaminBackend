let express = require('express')
let app = express()
// const controller = require('../controller/admin')
const { authenticateToken } = require('../helper/middleware');
const { getAllMatchesList } = require('../controller/gaming/cricket');

app.get('/getAllMatchesList',authenticateToken,getAllMatchesList)
 
module.exports = app

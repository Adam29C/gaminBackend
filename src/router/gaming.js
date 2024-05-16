let express = require('express')
let app = express()
// const controller = require('../controller/admin')
const { authenticateToken } = require('../helper/middleware');
const { getAllMatchesList, getSeriesList } = require('../controller/gaming/cricket');

app.get('/getAllMatchesList',authenticateToken,getAllMatchesList);
app.get("/getSeriesList",authenticateToken,getSeriesList)
 
module.exports = app

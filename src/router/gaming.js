let express = require('express')
let app = express()
// const controller = require('../controller/admin')
const { authenticateToken } = require('../helper/middleware');
const { getAllMatchesList, getSeriesList, getMatchsList, matchDetails } = require('../controller/gaming/cricket');

app.get('/getAllMatchesList', authenticateToken, getAllMatchesList);
app.get("/getSeriesList", authenticateToken, getSeriesList)
app.get("/getMatchsList/:seriesId", authenticateToken, getMatchsList);
app.get("/matchDetails/:matchId",authenticateToken,matchDetails)
module.exports = app

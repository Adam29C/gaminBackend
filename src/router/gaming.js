let express = require('express')
let app = express();
const { authenticateToken } = require('../helper/middleware');
const { getAllMatchesList, getSeriesList, getMatchList, matchDetails } = require('../controller/gaming/cricket');

app.get('/getAllMatchesList', authenticateToken, getAllMatchesList);
app.get("/getSeriesList", authenticateToken, getSeriesList)
app.get("/getMatchList/:seriesId", authenticateToken, getMatchList);
app.get("/matchDetails/:matchId",authenticateToken,matchDetails)
module.exports = app

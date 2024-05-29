const express = require('express');
const { webData } = require('../controller/webData');
const app = express();

app.post('/webDetails', webData);

module.exports=app
// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./src/router');
require("./src/connection/db");
const morgan = require('morgan');
const app = express();

// Middleware setup
const corsOption = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Define routes
app.use('/api/v1', route);

//---------seeders start----------------//

//require('./src/seeders/adminSeeders');

// Start the server
let port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});

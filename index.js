// Import required modules
require('dotenv').config(); 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const route = require('./src/router');
const connection =require("./src/connection/db")
const app = express(); 

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

// Define routes
app.use('/api/v1', route); 

//---------seeders start----------------//

//require('./src/seeders/adminSeeders');

// Start the server
let port = process.env.PORT; 
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

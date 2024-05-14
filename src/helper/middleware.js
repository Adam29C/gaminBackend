// Importing the bcryptjs library for password hashing
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TokenData = require("../model/token")
const client = require('twilio')(accountSid, authToken);

// Function to hash the given password using bcrypt
exports.hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    return null;
}

// Function to compare the given password with a hash using bcrypt
exports.comparePassword = async (pass, hash) => {
    try {
        const match = await bcrypt.compare(pass.toString(), hash);
        if (match) {
            return match;
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}

// Middleware function to authenticate a token
exports.authenticateToken = async (req, res, next) => {
    const authToken = req.header('Authorization');
    if (!authToken) return res.status(401).send('Please provide a token');
 
    let token = authToken.split(' ').slice(-1)[0];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the token exists in the database
        const tokenExists = await TokenData.exists({ token });
        if (!tokenExists) {
            return res.status(403).send({ err: 'Token not found' });
        }

        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(403).send({err:'Invalid token'});
    }
}

// Function to generate a random number within the specified range
exports.generateRandomNumber = async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to send a sms to given number
exports.sendSMS = async (phone, otp) => {
    let msgOptions = { from: '+19523143917', body: `your otp is ${otp}`, to: `+91${phone}` }
    try {
        let data = await client.messages.create(msgOptions)
        return data
    } catch (error) {
        return error
    }
}



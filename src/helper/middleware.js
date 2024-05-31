// Importing the bcryptjs library for password hashing
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TokenData = require("../model/token")
const client = require('twilio')(accountSid, authToken);
const Msg = require("../helper/messages")
const User = require("../model/user");
// Function to hash the given password using bcrypt
exports.hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    return null;
};

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
};
exports.authenticateToken = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            let token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
          
            if (!decoded) {
                return res.status(400).send({
                    statusCode: 400,
                    status: Msg.failure,
                    msg: "Token Expire",
                });
            }
            if (decoded.info.id) {
                let userDetails = await User.findOne({ _id: decoded.info.id });
                if (!userDetails) {
                    return res.status(400).send({
                        statusCode: 400,
                        status: Msg.failure,
                        msg: "User Not Found",
                    });
                }
                await User.findOneAndUpdate(
                    { _id: decoded.info.id },
                    { ipAddress: req.connection.remoteAddress }
                );
                if (userDetails.role != 0) {
                    let data = await TokenData.findOne({
                        token: token,
                        userId: decoded.info.id,
                    });
                    if (!data) {
                        return res.status(401).send({
                            statusCode: 401,
                            status: Msg.failure,
                            msg: "Token Not Found In Db",
                        });
                    }
                }
                req.decoded = decoded;
            } else {
                let data = await TokenData.findOne({
                    token: token,
                    deviceId: decoded.info.deviceId,
                });
                if (!data) {
                    return res.status(401).send({
                        statusCode: 401,
                        status:"Failure",
                        msg:  "Token Not Found In Db",
                    });
                }
                req.decoded = decoded;
            }
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: Msg.failure,
                msg: Msg.tokenNotfound
            });
        }
        next();
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg:error.message
        });
    }
}
// Function to generate a random number within the specified range
exports.generateRandomNumber = async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to send a sms to given number
exports.sendSMS = async (phone, otp) => {
    let msgOptions = { from: '+19523143917', body: `your otp is ${otp}`, to: `+91${phone}` }
    try {
        let data = await client.messages.create(msgOptions)
        return data
    } catch (error) {
        return error
    }
};



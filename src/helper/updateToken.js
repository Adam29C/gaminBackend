const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user"); 
const tokenData = require("../model/token"); 

const tokenUpdate = async (userId, role) => {
    let token;
    let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (userId) {
        let userDetails = await User.findOne({ _id: userId }); 

        if (!userDetails) {
            throw new Error("User details not found");
        }

        const payload = { userId: userDetails._id, role: role };
        token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_IN });

        await tokenData.updateOne(
            { userId: userId },
            { $set: { userId: userDetails._id, role: role, token: token } },
            { upsert: true } 
        );

        return token;
    } else {
        throw new Error("Invalid userId");
    }
};

module.exports = tokenUpdate;

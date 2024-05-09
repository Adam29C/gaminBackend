const jwt = require("jsonwebtoken");

const generateAuthToken = async (req, res) => {
    try {
        const { userId, deviceId } = req.body;
        if (!userId || deviceId) {
            res.status(400).json({
                statusCode: 400,
                status: "failure",
                message: "Please Provide the valid Data"
            })
        }
        let token;
        let query;
        let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        if (userId) {
            let details = await user.findOne({
                _id: new mongoose.Types.ObjectId(id)
            })
            if (!details) {
                return res.status(400).json({
                    statusCode: 400,
                    status: "failure",
                    message: "details not found",
                });
            }
            query = { userId: userId };
            token = jwt.sign(
                {
                    info: {
                        date: new Date()
                    },
                },
                JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRE_IN,
                }
            );
        } else {
            query = { deviceId: deviceId };
            token = jwt.sign(
                {
                    info: {
                        deviceId: deviceId,
                    },
                },
                JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRE_IN,
                }
            );
        }
        let data = await tokenData.findOne(query);
        if (data) {
            await tokenData.updateOne({ _id: data._id }, { token: token })
        } else {
            let tokenDat = new tokenDat({
                toke: token,
                userId: id ? id : "",
                deviceId: deviceId ? deviceId : "",
            });
            await tokenDat.save();
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: token,
        });
    }
    catch (err) {
        return res.status(500).json({
            statusCode: 500,
            status: "failure",
            message: "Internal Server Error",
        });
    }
}

module.exports = { generateAuthToken }
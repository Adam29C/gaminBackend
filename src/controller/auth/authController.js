const {
    hashPassword,
    generateRandomNumber,
    sendSMS,
} = require("../../helper/middleware");
const Msg = require("../../helper/messages");
const user = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const mongoose = require("mongoose")
const tokenData = require("../../model/token")
const tokenUpdate = require("../../helper/updateToken");
const wallet = require("../../model/waled")

//Function to generate the auth token
const generateAuthToken = async (req, res) => {
    try {
        const { userId, deviceId } = req.body;

        if (!userId && !deviceId) {
            return res.status(400).json({
                statusCode: 400,
                status: "failure",
                message: "Please provide valid data: userId or deviceId is required",
            });
        }

        const query = userId ? { userId } : { deviceId };
        const tokenPayload = userId ? { info: { userId, date: new Date() } } : { info: { deviceId, date: new Date() } };

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_IN });

        const existingTokenData = await tokenData.findOne(query);
        if (existingTokenData) {
            existingTokenData.token = token;
            await existingTokenData.save();
        } else {
            await tokenData.create({
                token,
                userId: userId || "",
                deviceId: deviceId || "",
            });
        }

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: token,
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            status: "failure",
            message: Msg.failure,
        });
    }
};

//Function to send the otp 
const resendOtpFn = async (req, res) => {
    try {
        const id = req.decoded.info.userId ? req.decoded.info.userId : req.decoded.info.deviceId;
        const { mobileNumber } = req.body;
        const userInfo = await tokenData.findOne({ userId: id }) || await tokenData.findOne({ deviceId: id });

        if (!userInfo) {
            return res.status(400).send({
                status: false,
                msg: Msg.detailNotfound
            });
        }
        let userExists = await user.findOne({ mobileNumber: mobileNumber });
        if (!userExists) {
            const randomNumber = await generateRandomNumber(10000, 20000);
            let newUser = {
                mobileNumber: mobileNumber,
                otp: randomNumber,
            };
            await user.create(newUser);
            await sendSMS(mobileNumber, randomNumber);
            return res.status(200).send({
                status: true,
                msg: Msg.otpSend,
            });
        } else {
            if (userExists.isVerified) {
                return res.status(200).send({
                    status: false,
                    msg: Msg.mobileAlreadyInUse,
                });
            } else {
                const randomNumber = await generateRandomNumber(10000, 20000);
                await user.updateOne(
                    { mobileNumber: mobileNumber },
                    { $set: { otp: randomNumber } }
                );
                await sendSMS(mobileNumber, randomNumber);
                return res.status(200).send({
                    status: true,
                    msg: Msg.otpSend,
                });
            }
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        });
    }
};

// Function to verify OTP
const otpVerifyFn = async (req, res) => {
    try {
        let { mobileNumber, otp, isForgot } = req.body;
        const id = req.decoded.info.userId ? req.decoded.info.userId : req.decoded.info.deviceId;
        const userInfo = await tokenData.findOne({ userId: id }) || await tokenData.findOne({ deviceId: id });
        if (!userInfo) {
            return res.status(400).send({
                status: false,
                msg: Msg.detailNotfound
            });
        }
        let isExists = await user.findOne({ mobileNumber: mobileNumber });
        if (isExists) {
            if (!isForgot) {
                if (isExists.isVerified) {
                    return res.status(200).send({
                        status: true,
                        msg: Msg.allReadyOtpVerified,
                    });
                }
            }
            let code = parseInt(isExists.otp);
            if (code === otp) {
                await user.updateOne(
                    { mobileNumber: mobileNumber },
                    { $set: { isVerified: true } }
                );
                return res.status(200).send({
                    status: true,
                    msg: Msg.otpVerified,
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.wrongOtp,
                });
            }
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.inValidPhone,
            });
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "failure",
            message: err.message,
        });
    }
};

//Function to register the user
const userRegister = async (req, res) => {
    try {
        let { name, mobileNumber, password } = req.body;
        let newPassword = await hashPassword(password);
        const id = req.decoded.info.userId ? req.decoded.info.userId : req.decoded.info.deviceId;
        const userInfo = await tokenData.findOne({ userId: id }) || await tokenData.findOne({ deviceId: id });
        if (!userInfo) {
            return res.status(400).send({
                status: false,
                msg: Msg.detailNotfound
            });
        }
        const findUser = await user.findOne({ mobileNumber: mobileNumber });
        if (findUser) {
            await user.updateOne({ mobileNumber }, {
                $set: {
                    name: name,
                    password: newPassword,
                    role: 2,
                    knowPassword: password
                }
            });
            console.log("1s")

            let obj={
                userId:findUser._id,
                amount:0
            }
            const a =await wallet.create(obj);
            console.log(a,"a");
            return res.status(200).send({
                status: true,
                msg: Msg.userRegister,
            });
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.err,
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure,
        });
    }
};

//Function To Login
const login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        const id = req.decoded.info.userId ? req.decoded.info.userId : req.decoded.info.deviceId;
        const userInfo = await tokenData.findOne({ userId: id }) || await tokenData.findOne({ deviceId: id });
        if (!userInfo) {
            return res.status(400).send({
                status: false,
                msg: Msg.detailNotfound
            });
        }
        const userExists = await user.findOne({ mobileNumber });
        if (!userExists) {
            return res.status(200).send({
                status: false,
                msg: Msg.phoneNotRegister,
                
            });
        }
        if (!userExists.isVerified) {
            return res.status(400).send({
                status: false,
                msg: Msg.phoneNumberNotVerified,
                isVerified:userExists.isVerified
            });
        }
        const checkPassword = await bcrypt.compare(password, userExists.password);
        if (checkPassword) {
            const token = await tokenUpdate(userExists._id, userExists.role);
            console.log(token,"token")
            await user.updateOne({ mobileNumber: userExists.mobileNumber }, { $set: { loginStatus: "logIn" } });             
            let obj = {
                mobileNumber: userExists.mobileNumber,
                id: userExists._id,
                name: userExists.name,
                role: userExists.role,
                isVerified:userExists.isVerified
            }
            return res.status(200).send({
                status: true,
                msg: Msg.loggedIn,
                token: token,
                details: obj,
            });
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.inValidPassword,
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure,
        });
    }
};

// Function to change  password
const changePassword = async (req, res) => {
    try {
        let { user_id, old_password, new_password } = req.body;
        let isExists = await user.findOne({ _id: user_id });
        if (isExists) {
            let getOldPassword = isExists.password;
            let checkPassword = await bcrypt.compare(old_password, getOldPassword);
            if (checkPassword) {
                let newPassword = await hashPassword(new_password);
                const filter = { _id: user_id };
                const update = { $set: { password: newPassword,knowPassword:new_password}};
                await user.updateOne(filter, update);
                return res.status(200).send({
                    statusCode: 200,
                    status: "Success",
                    msg: Msg.pwdChangeSuccessfully
                });
            } else {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.inValidPassword
                });
            }
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.userNotExists
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

// Function to send OTP for password reset
const forgetPasswordSendOtpFn = async (req, res) => {
    try {
        let { mobileNumber } = req.body;
        let isPhoneNumberExists = await user.findOne({ mobileNumber: mobileNumber });
        if (isPhoneNumberExists) {
            const randomNumber = await generateRandomNumber(10000, 20000);
            const filter = { mobileNumber: mobileNumber };
            const update = { $set: { otp: randomNumber }, };
            const check = await user.updateOne(filter, update);
            if (check) {
                await sendSMS(mobileNumber, randomNumber);
                return res.status(200).send({
                    status: true,
                    msg: Msg.otpSend
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.otpNotSend
                });
            }
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.phoneNotRegister
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        });
    }
};

// Function to reset  password using OTP verification
const forgetPasswordFn = async (req, res) => {
    try {
        let { mobileNumber, otp, password } = req.body;
        let isPhoneNumberExists = await user.findOne({ mobileNumber: mobileNumber });
        if (isPhoneNumberExists) {
            if (otp == isPhoneNumberExists.otp) {
                let newPassword = await hashPassword(password);
                const filter = { mobileNumber: mobileNumber };
                const update = { $set: { password: newPassword, knowPassword: password } };
                const check = await user.updateOne(filter, update);
                if (check) {
                    return res.status(200).send({
                        status: true,
                        msg: Msg.passwordResetSuccessfully
                    });
                } else {
                    return res.status(200).send({
                        status: false,
                        msg: Msg.passwordNotReset
                    });
                }
            } else {
                return res.status(200).send({
                    status: false,
                    msg: "Please provide the valid otp"
                });
            }
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.phoneNotRegister
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        });
    }
};

// Function to get user profile
const getUserProfileFn = async (req, res) => {
    try {
        let { userId } = req.query;
        let isuserExists = await user.findOne({ _id: userId });
        let obj = {
            userId: isuserExists._id,
            name: isuserExists.name,
            mobileNumber: isuserExists.mobileNumber,
            isVarify:isuserExists.isVerified,
            isWithdraw:isuserExists.isWithdraw
        }
        if (isuserExists) {
            return res.status(200).send({
                status: "Success",
                msg: Msg.userProfileFoundSuccess,
                data: obj
            });
        } else {
            return res.status(200).send({
                status:"Failure" ,
                msg: Msg.userProfileNotFound,
                data: []
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

module.exports = { userRegister, otpVerifyFn, resendOtpFn, login, changePassword, forgetPasswordSendOtpFn, forgetPasswordFn, getUserProfileFn, generateAuthToken }
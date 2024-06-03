// Import required modules
const { hashPassword, comparePassword, generateRandomNumber } = require('../../helper/middleware');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const Msg = require('../../helper/messages');
const user = require('../../model/user');
const game = require("../../model/game");
const waled = require("../../model/waled");
const PaymentHistory = require('../../model/paymentHistory');
const rule = require("../../model/rule");
const adminAccountDetails = require('../../model/adminAccountDetails');
const mongoose = require('mongoose');
const paymentRequest = require('../../model/paymentRequest');
const ObjectId = mongoose.Types.ObjectId;
// Function to handle creation of sub-admin
const createSubAdminFn = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        let { adminId, name, mobileNumber, password, role, permission } = req.body;
        if (Role === 0) {
            let isExists = await user.findOne({ mobileNumber: mobileNumber });
            if (isExists && isExists.role === 1) {
                return res.status(400).send({
                    statusCode: 400,
                    status: false,
                    msg: 'user already registered'
                });
            } else {
                let newPassword = await hashPassword(password);
                let obj = {
                    name: name,
                    email: "",
                    address: "",
                    otp: 0,
                    mobileNumber: mobileNumber,
                    password: newPassword,
                    role: role,
                    knowPassword: password,
                    createdBy: adminId
                };
                let data = await user.insertMany(obj);
                if (data) {
                    if (permission && permission !== null) {
                        let gameCreated = permission.gameCreated;
                        let gameEdit = permission.gameEdit;
                        let gameDelete = permission.gameDelete;
                        let viewGame = permission.viewGame;
                        let createUser = permission.createUser;
                        let viewUser = permission.viewUser
                        const filter = { mobileNumber: mobileNumber };
                        const update = {
                            $set:
                            {
                                'permissions.createGame': gameCreated,
                                'permissions.editGame': gameEdit,
                                'permissions.deleteGame': gameDelete,
                                'permissions.viewGame': viewGame,
                                'permissions.createUser': createUser,
                                'permissions.viewUser': viewUser
                            }
                        };
                        const check = await user.updateOne(filter, update);
                        if (check) {
                            return res.status(201).send({
                                statusCode: 201,
                                status: true,
                                msg: 'user registered successfully',
                                data: `this is your user name ${mobileNumber} and your password ${password}`
                            });
                        } else {
                            return res.status(400).send({
                                statusCode: 400,
                                status: false,
                                msg: 'user not registered',
                                data: data[0]
                            })
                        }
                    } else {
                        return res.status(200).send({
                            status: true,
                            msg: 'user registered successfully',
                            data: `this is your id ${mobileNumber} and your password ${password}`
                        });
                    }
                } else {
                    return res.status(400).send({
                        statusCode: 400,
                        status: false,
                        msg: 'user not created'
                    });
                }
            }
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: false,
                msg: Msg.adminCanAccess
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        })
    }
};

//fetch list of all sub admin
const subAdminList = async (req, res) => {
    try {
        let role = req.decoded.info.roles;
        const { adminId } = req.query;
        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!adminId) {
            return res.status(500).send({
                statusCode: 500,
                status: "Failure",
                msg: "Admin Id is required"
            });
        }

        const subAdminData = await user.find({ createdBy: adminId, isDeleted: false });
        let arrVal = [];
        for (let details of subAdminData) {
            arrVal.push({
                name: details.name,
                mobileNumber: details.mobileNumber,
                isVerified: details.isVerified,
                createdBy: details.createdBy,
                loginStatus: details.loginStatus,
                role: details.role,
                isDeleted: details.isDeleted,
                createdAt: details.createdAt,
                subAdminId: details._id,
                isActive: details.isActive
            }

            )
        }
        if (subAdminData) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                list: arrVal
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        })
    }
};

//fetch list of all sub admin
const userList = async (req, res) => {
    try {
        let role = req.decoded.info.roles;
        const { adminId } = req.query;
        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!adminId) {
            return res.status(500).send({
                statusCode: 500,
                status: "Failure",
                msg: "Admin Id is required"
            });
        }

        const subAdminData = await user.find({ createdBy: "self", isDeleted: false, });
        let arrVal = [];
        for (let details of subAdminData) {
            arrVal.push({
                name: details.name,
                mobileNumber: details.mobileNumber,
                isVerified: details.isVerified,
                createdBy: details.createdBy,
                loginStatus: details.loginStatus,
                role: details.role,
                isDeleted: details.isDeleted,
                createdAt: details.createdAt,
                userId: details._id,
                isActive: details.isActive,
            },

            )
        }
        if (subAdminData) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "User List Show Successfully",
                data: arrVal
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        })
    }
};
//Delete sub admin 
const deleteSubAdmin = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { adminId, id } = req.body

        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!adminId || !id) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'adminId and id  is required'
            });
        }
        const deleteSubAdmin = await user.updateOne(
            { _id: id }, { $set: { isDeleted: true } }
        );
        if (deleteSubAdmin) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "Sub Admin Deleted Successfully"
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

//Game Created By Admin
const gamesCreatedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        let { gameName, isShow } = req.body;
        if (!gameName || !isShow) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game name and isShow is required"
            });
        }
        if (Role !== 0) {
            {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.adminCanAccess
                });
            }
        }
        const check = await game.findOne({ gameName });
        if (check) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game Is Already Exist!"
            });
        }
        let obj = {
            gameName: gameName,
            isShow: isShow
        };
        let data = await game.create(obj);
        if (data) {
            return res.status(201).send({
                statusCode: 201,
                status: "Success",
                msg: Msg.gameCreatedSuccessfully
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Success",
                msg: Msg.gameNotCreated
            });
        }

    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        })
    }
};

//Admin Can Update Game With The Help Of Game Id
const gamesUpdatedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        let { gameId, gameName, isShow } = req.body;
        if (!gameName || typeof isShow === 'undefined') {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game name and isShow is required"
            });
        }
        if (Role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        const check = await game.findOne({ gameName });
        if (check) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game Name Is Already Exist Please Try Another Name!"
            });
        }

        let isExists = await game.findOne({ _id: gameId });

        if (isExists) {
            await game.updateOne({ _id: gameId }, { $set: { gameName: gameName, isShow: isShow } })
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.gameEditedSuccessfully
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.gameNotFound
            });
        }

    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        })
    }
};

//Update Game status
const updateGameStatus = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { gameId, isShow } = req.body;

        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }

        if (!gameId || typeof isShow !== 'boolean') {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'gameId and isShow are required and isShow must be a boolean'
            });
        }

        const gameToUpdate = await game.findByIdAndUpdate(
            gameId,
            { $set: { isShow: isShow, updatedAt: new Date() } },
            { new: true }
        );

        if (!gameToUpdate) {
            return res.status(400).send({
                statusCode: 404,
                status: "Failure",
                msg: "Game Not Updated "
            });
        }

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: Msg.statusUpdateSuccessfully
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

//Admin Can delete Games With The Help Of Game Id
const gamesDeletedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        let { gameId } = req.query;
        if (!gameId) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game Id is required"
            });
        }
        if (Role === 0) {
            let gameDeleted = await game.deleteOne({ _id: gameId });
            if (gameDeleted) {
                return res.status(200).send({
                    statusCode: 200,
                    status: "Success",
                    msg: Msg.gameDeletedSuccessfully
                });
            } else {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.gameNotDeleted
                });
            }
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        })
    }
};

//Get List Of Game
const gamesList = async (req, res) => {
    try {
        const gameList = await game.find();
        if (gameList) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.gameListFound,
                data: gameList
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.gameNotFound,
                data: []
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        })
    }
};

//Add Amount To Waled
const addAmount = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        const { userId, amount, description } = req.body;
        if (Role === 0) {
            let amountSave = await new waled({ userId, amount, description }).save();
            if (amountSave) {
                // Create entry in payment history
                const paymentHistory = new PaymentHistory({ userId, amount, description });
                await paymentHistory.save();

                return res.status(200).send({
                    status: true,
                    msg: Msg.amountAdded,
                    data: amountSave
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.gameNotFound,
                    data: []
                });
            }
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.adminCanAccess
            });
        }
    } catch (error) {
        return res.json(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        })
    }
}

//Add Amount To Waled
const paymentHistory = async (req, res) => {
    try {
        const { paymentStatus, adminId } = req.body;
        const Role = req.decoded.info.roles;
        if (!paymentStatus || !adminId) {
            return res.status(400).send({
                statusCode: 400,
                msg: "Failure",
                data: "Payment Status And AdminId is required"
            });
        }

        if (Role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: Msg.adminCanAccess
            });
        }
        let findPaymentHistory = await paymentRequest.find(paymentStatus == "all" ? {} : { paymentStatus });

        if (!findPaymentHistory) {
            return res.status(404).send({
                status: "Failure",
                msg: "No payment history found",
                data: []
            });
        }

        // Fetch user details for each payment history item
        const userIds = findPaymentHistory.map(payment => payment.userId);
        const users = await user.find({ _id: { $in: userIds } }).select('name mobileNumber');
        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});

        // Merge user details with payment history
        const paymentHistoryWithUserDetails = findPaymentHistory.map(payment => {
            const user = userMap[payment.userId];
            return {
                ...payment._doc,
                userName: user ? user.name : null,
                mobileNumber: user ? user.mobileNumber : null
            };
        });

        return res.status(200).send({
            status: "Success",
            msg: Msg.paymentHistory,
            data: paymentHistoryWithUserDetails
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        })
    }
};

//Admin update Payment Request Status
const updatePaymentRequestStatus = async (req, res) => {
    try {
        const { adminId, paymentHistoryId, status, description } = req.body;
        const Role = req.decoded.info.roles;

        // Check for required fields
        if (!paymentHistoryId || !adminId || !status) {
            return res.status(400).send({
                statusCode: 400,
                msg: "Failure",
                data: "PaymentHistoryId, AdminId, and status are required"
            });
        }
        // Check for admin role
        if (Role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "failure",
                msg: "Admin access required"
            });
        }

        
        // Find the payment history
        const findPaymentHistory = await paymentRequest.findOne({ paymentHistoryId: paymentHistoryId });
        if (!findPaymentHistory) {
            return res.status(404).send({
                statusCode: 404,
                status: "Failure",
                msg: "Payment history not found"
            });
        }

        // Check payment history status
        if(findPaymentHistory.status=="approve" ||findPaymentHistory.status=="decline"){
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Payment Is Already Approve Or Decline"
            });
        }

        // Define the update object
        const updateData = { status: status };
        if (description !== undefined) {
            updateData.description = description;
        }

        // Update the payment status
        const updateStatus = await paymentRequest.updateOne({ paymentHistoryId: paymentHistoryId }, { $set: updateData });
        await PaymentHistory.updateOne({ _id: paymentHistoryId }, { $set: updateData });

        // Retrieve the updated payment request
        const check = await paymentRequest.findOne({ paymentHistoryId: paymentHistoryId });
        if (check.status === "approve") {
            const wallet = await waled.findOne({ userId: check.userId });

            if (check.paymentStatus === "debit") {
                let finaldebitAmount = wallet.amount - check.amount;
                let finalDebitBuffer = wallet.debitBuffer - check.amount;
                await waled.updateOne({ userId: check.userId }, { amount: finaldebitAmount, debitBuffer: finalDebitBuffer });
            } else if (check.paymentStatus === "credit") {
                let finalCreditAmount = wallet.amount + check.amount;
                let finalCreditBuffer = wallet.creditBuffer - check.amount;
                await waled.updateOne({ userId: check.userId }, { amount: finalCreditAmount, creditBuffer: finalCreditBuffer });
            }
        }

        // Check if the update was successful
        if (updateStatus.modifiedCount === 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Payment status not updated"
            });
        }

        // Successful response
        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: "Payment status updated successfully"
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "Internal Server Error"
        });
    }
};


//Add Game Rules
const addRules = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { userId, title, description } = req.body;

        if (role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: Msg.adminCanAccess
            });
        }

        if (!userId || !description) {
            return res.status(400).send({
                statusCode: 400,
                status: false,
                msg: 'UserId and message are required'
            });
        }
        const check = await rule.findOne({ title });
        if (check) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "This Rule Title Is Already Exist!"
            });
        }
        const newRule = new rule({
            userId,
            description,
            title
        })
        await newRule.save();

        return res.status(201).send({
            statusCode: 201,
            status: "Success",
            msg: Msg.rulesAddedSuccessfully
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: false,
            msg: Msg.failure
        });
    }
};

//Update rule 
const updateRules = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { ruleId, status, title, description } = req.body;

        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }

        if (!ruleId || typeof status !== 'boolean') {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'ruleId and status are required and status must be a boolean'
            });
        }

        const check = await rule.findOne({ title });
        if (check) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "This Rule Title Is Already Exist!"
            });
        }

        const ruleToUpdate = await rule.findByIdAndUpdate(
            ruleId,
            { $set: { status: status, title: title, description: description, updatedAt: new Date() } },
            { new: true }
        );

        if (!ruleToUpdate) {
            return res.status(400).send({
                statusCode: 404,
                status: "Failure",
                msg: Msg.ruleNotFound
            });
        }

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: Msg.ruleUpdateSuccessfully
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

//Update Rule Status 
const updateRulesStatus = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { ruleId, status } = req.body;

        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }

        if (!ruleId || typeof status !== 'boolean') {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'ruleId and status are required and status must be a boolean'
            });
        }

        const ruleToUpdate = await rule.findByIdAndUpdate(
            ruleId,
            { $set: { status: status, updatedAt: new Date() } },
            { new: true }
        );

        if (!ruleToUpdate) {
            return res.status(400).send({
                statusCode: 404,
                status: "Failure",
                msg: Msg.ruleNotFound
            });
        }

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: Msg.statusUpdateSuccessfully
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

//Delete Rules 
const deleteRules = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { ruleId } = req.query;

        if (role !== 0) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!ruleId) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'ruleId is required'
            });
        }
        const ruleDelete = await rule.deleteOne({
            _id: ruleId
        });
        if (ruleDelete) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.rulesDeleteSuccessfully
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

//Get All Rules
const getRules = async (req, res) => {
    try {

        const rules = await rule.find({});

        if (rules) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.allRulesFound,
                data: rules
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.allRulesFound,
                data: rules
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

//CHeck Token Function
const checkToken = async (req, res) => {
    try {
        const { Token } = req.body;
        // Validate userId
        if (!Token) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Token is required."
            });
        }

        const check = jwt.verify(Token, process.env.JWT_SECRET_KEY);
        if (check) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "Valid Token."
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Token is expired."
            });
        }

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "Internal Server Error",
        });
    }
};

//Admin Add Account Detail
const addAdminAccountDetail = async (req, res) => {
    try {
        const { id, isBank, accountNumber, accountHolderName, ifscCode, bankName, upiId, upiName, minAmount, maxAmount } = req.body;
        if (!id) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "User ID, Password, and isBank field are required."
            });
        }
        const adminDetails = await user.findOne({ _id: id });
        if (!adminDetails) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "User does not exist."
            });
        }
        if (accountNumber) {
            const existingAccount = await adminAccountDetails.findOne({
                adminId: id,
                'bank.accountNumber': accountNumber
            });
            if (existingAccount) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "Account number already exists."
                });
            }
        }

        if (upiId) {
            const existingUpi = await adminAccountDetails.findOne({
                adminId: id,
                'upi.upiId': upiId
            });
            if (existingUpi) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "UPI ID already exists."
                });
            }
        }
        // Process image uploads
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.location;
        }

        let updateData = {};
        if (isBank == "true") {
            updateData = { $push: { bank: { accountNumber, accountHolderName, ifscCode, bankName, isBank, bankImage: imageUrl, maxAmount: maxAmount, minAmount: minAmount } }, $set: { updatedAt: Date.now() } };
        } else {
            updateData = { $push: { upi: { upiId, upiName, isBank, barCodeImage: imageUrl, maxAmount: maxAmount, minAmount: minAmount } }, $set: { updatedAt: Date.now() } };
        }

        // Find the existing account details document or create a new one
        await adminAccountDetails.findOneAndUpdate(
            { adminId: id },
            updateData,
            { new: true, upsert: true }
        );

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: Msg.accountDetailsSave
        });
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure,
        });
    }
};

//Admin All Account List
const adminAccountsList = async (req, res) => {
    try {
        const { adminId } = req.query;
        if (!adminId) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin Id Is Required",
            });
        }

        const adminAccount = await adminAccountDetails.find({ adminId });
        let obj = {
            adminId: adminAccount[0].adminId,
            bankList: adminAccount[0].bank,
            upiList: adminAccount[0].upi
        }
        if (adminAccount) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.adminAccountsList,
                data: obj
            });
        }

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure,
        });
    }
};

//Delete Admin Account Detail By Id
const deleteAdminAccountDetail = async (req, res) => {
    try {
        const { adminId, isBank, id } = req.body;

        if (!adminId) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin Id Is Required",
            });
        }
        // Check if the user exists
        const findUser = await user.findOne({ _id: adminId });
        if (!findUser) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: Msg.userNotExists
            });
        }

        let query;
        if (isBank) {
            query = { $pull: { 'bank': { _id: id } } }
        } else {
            query = { $pull: { 'upi': { _id: id } } }
        }

        const result = await adminAccountDetails.updateOne(
            { adminId: adminId }, query
        );

        if (result.modifiedCount > 0) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "Account detail deleted successfully."
            });
        } else {
            return res.status(404).send({
                statusCode: 404,
                status: "Failure",
                msg: "Account detail not found or already deleted."
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

//Update account Detail By Id
const updateAdminAccountDetail = async (req, res) => {
    try {
        const { adminId, id, isBank, accountNumber, accountHolderName, ifscCode, bankName, upiId, upiName, minAmount, maxAmount } = req.body;
        if (!adminId || !id) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin Id and account Id are required."
            });
        }

        const adminDetails = await user.findOne({ _id: adminId });
        if (!adminDetails) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin does not exist."
            });
        }

        // Process image uploads
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.location;
        }

        let updateData = {};
        const objectIdAccountId = new ObjectId(id);

        if (isBank === "true") {
            const existingAccount = await adminAccountDetails.findOne({
                adminId: adminId,
                bank: { $elemMatch: { _id: objectIdAccountId } }
            });

            if (!existingAccount) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.bankAccountIdNotExist
                });
            }

            updateData = {
                $set: {
                    'bank.$[elem].accountNumber': accountNumber,
                    'bank.$[elem].accountHolderName': accountHolderName,
                    'bank.$[elem].ifscCode': ifscCode,
                    'bank.$[elem].bankName': bankName,
                    'bank.$[elem].bankImage': imageUrl,
                    'bank.$[elem].minAmount': minAmount,
                    'bank.$[elem].maxAmount': maxAmount,
                    updatedAt: Date.now()
                }
            };

            await adminAccountDetails.updateOne(
                { adminId: adminId, 'bank._id': objectIdAccountId },
                updateData,
                { arrayFilters: [{ 'elem._id': objectIdAccountId }] }
            );

        } else {
            const existingUpi = await adminAccountDetails.findOne({
                adminId: adminId,
                upi: { $elemMatch: { _id: objectIdAccountId } }
            });
            if (!existingUpi) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.upiAccountIdNotExist
                });
            }

            updateData = {
                $set: {
                    'upi.$[elem].upiId': upiId,
                    'upi.$[elem].upiName': upiName,
                    'upi.$[elem].barCodeImage': imageUrl,
                    'upi.$[elem].minAmount': minAmount,
                    'upi.$[elem].maxAmount': maxAmount,
                    updatedAt: Date.now()
                }
            };

            await adminAccountDetails.updateOne(
                { adminId: adminId, 'upi._id': objectIdAccountId },
                updateData,
                { arrayFilters: [{ 'elem._id': objectIdAccountId }] }
            );
        }

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: Msg.accountUpdate
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure,
        });
    }
};

//Dashbord count api user and sub admin
const countDashboard = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { adminId } = req.query;

        if (role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: "Admin can access only."
            });
        }

        const adminDetails = await user.findOne({ _id: adminId });

        if (!adminDetails) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin does not exist."
            });
        }

        const counts = await user.aggregate([
            {
                $match: {
                    createdBy: "self"
                }
            },
            {
                $group: {
                    _id: "$isVerified",
                    count: { $sum: 1 }
                }
            }
        ]);

        const verifiedCount = counts.find(c => c._id === true)?.count || 0;
        const notVerifiedCount = counts.find(c => c._id === false)?.count || 0;
        const totalCount = verifiedCount + notVerifiedCount

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: "Counts fetched successfully",
            data: {
                totalCount,
                verifiedCount,
                notVerifiedCount
            }
        });

    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "Internal Server Error"
        });
    }
};

//Deactivate User count api user and sub admin
const deactivateUser = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { adminId, id, isActive } = req.body;

        if (!adminId || !id) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: "adminId and id is required."
            });
        }

        if (role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: "Admin can access only."
            });
        }

        const adminDetails = await user.findOne({ _id: adminId });

        if (!adminDetails) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Admin does not exist."
            });
        }

        const updateUserState = await user.updateOne({ _id: id }, { $set: { isActive: isActive } })

        if (updateUserState) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "User status change successfully",
            });
        }


    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "Internal Server Error"
        });
    }
};

module.exports = { addAdminAccountDetail, createSubAdminFn, subAdminList, gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, gamesList, addAmount, paymentHistory, addRules, updateRules, deleteRules, getRules, updateRulesStatus, checkToken, adminAccountsList, deleteAdminAccountDetail, updateAdminAccountDetail, deleteSubAdmin, updateGameStatus, userList, countDashboard, deactivateUser, updatePaymentRequestStatus }

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
const  mongoose  = require('mongoose');
// Function to handle creation of sub-admin
const createSubAdminFn = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { name, mobileNumber, password, role, permission } = req.body;
        if (Role === 0) {
            let isExists = await user.findOne({ mobileNumber: mobileNumber });
            if (isExists && isExists.role === 1) {
                return res.status(200).send({
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
                    knowPassword: password
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
                            return res.status(200).send({
                                status: true,
                                msg: 'user registered successfully',
                                data: `this is your user name ${mobileNumber} and your password ${password}`
                            });
                        } else {
                            return res.status(200).send({
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
                    return res.status(200).send({
                        status: false,
                        msg: 'user not created'
                    });
                }
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
};

//fetch list of all user and all sub admin
const subAdminList = async (req, res) => {
    try {
        let role = req.decoded.role;
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

        const subAdminData = await user.find({ createdBy: "admin" });
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
                createdAt: details.createdAt
            },

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

//fetch list of all user which is created by sub admin
const usersCreatedBySubAdmin = async (req, res) => {
    try {
        let { subAdminId } = req.body;
        if (!subAdminId) {
            return res.status(200).send({
                status: true,
                msg: Msg.idRequire
            });
        }
        const isSubAdminExists = await user.findOne({ _id: subAdminId });
        if (isSubAdminExists) {
            const fetchUserList = await userListNotFoundUser.find({ createdBy: { $eq: subAdminId } });
            if (fetchUserList && fetchUserList.length > 0) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.userListFoundSuccessfully,
                    data: fetchUserList
                });
            } else {
                return res.status(200).send({
                    status: true,
                    msg: Msg.userNotCreatedBySubAdmin,
                    data: []
                });
            }
        } else {
            return res.status(200).send({
                status: true,
                msg: Msg.subAdminNotExists,
                data: []
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

//Game Created By Admin
const gamesCreatedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { gameName, isShow } = req.body;
        if (!gameName || !isShow) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game name and isShow is required"
            });
        }
        if (Role === 0) {
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

//Admin Can Update Game With The Help Of Game Id
const gamesUpdatedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { gameId, gameName, isShow } = req.body;
        if (!gameName || typeof isShow === 'undefined') {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Game name and isShow is required"
            });
        }
        if (Role === 0) {
            let isExists = await game.findOne({ _id: gameId });
            console.log(isExists, "isExists")
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

//Admin Can delete Games With The Help Of Game Id
const gamesDeletedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
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
        let Role = req.decoded.role;
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
        let Role = req.decoded.role;
        if (Role === 0) {
            let findPaymentHistory = await PaymentHistory.find();
            if (findPaymentHistory) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.paymentHistory,
                    data: findPaymentHistory
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.paymentHistory,
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
};

//Add Game Rules
const addRules = async (req, res) => {
    try {
        const { role } = req.decoded;
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

const updateRules = async (req, res) => {
    try {
        const { role } = req.decoded;
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
        console.error(error);
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

const updateRulesStatus = async (req, res) => {
    try {
        const { role } = req.decoded;
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
        console.error(error);
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

const deleteRules = async (req, res) => {
    try {
        const { role } = req.decoded;
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
        console.log(ruleDelete, "ruleDeleteRuleDelete")
        if (ruleDelete) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: Msg.rulesDeleteSuccessfully
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: Msg.failure
        });
    }
};

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

const addAdminAccountDetail = async (req, res) => {
    try {
        const { id, isBank, accountNumber, accountHolderName, ifscCode, bankName, upiId, upiName} = req.body;
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
            updateData = { $push: { bank: { accountNumber, accountHolderName, ifscCode, bankName, isBank, bankImage: imageUrl } }, $set: { updatedAt: Date.now() } };
        } else {
            updateData = { $push: { upi: { upiId, upiName, isBank, barCodeImage: imageUrl } }, $set: { updatedAt: Date.now() } };
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
        { adminId:adminId  }, query
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

const updateAdminAccountDetail = async (req, res) => {
    try {
        const { id, accountId, isBank, accountNumber, accountHolderName, ifscCode, bankName, upiId, upiName } = req.body;
        if (!id) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "User ID is required."
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

        // Process image uploads
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.location;
        }

        let updateData = {};
        if (isBank === "true") {
            if (!accountNumber) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "Account number is required for bank details."
                });
            }

            const existingAccount = await adminAccountDetails.findOne({
                adminId: id,
                bank: {
                    "$elemMatch": {
                      "_id": accountId
                    }
                  }
            });
            console.log(existingAccount,"&&&&&&&&&&")
            if (!existingAccount) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "Account number does not exist."
                });
            }

            updateData = {
                $set: {
                    'bank.$.accountHolderName': accountHolderName,
                    'bank.$.ifscCode': ifscCode,
                    'bank.$.bankName': bankName,
                    'bank.$.bankImage': imageUrl,
                    updatedAt: Date.now()
                }
            };

            await adminAccountDetails.updateOne(
                { adminId: id, 'bank.accountNumber': accountNumber },
                updateData
            );

        } else {
            if (!upiId) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "UPI ID is required for UPI details."
                });
            }
            
            const existingUpi = await adminAccountDetails.findOne({
                adminId: id,
                'upi._id': accountId
            });
            if (!existingUpi) {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: "UPI ID does not exist."
                });
            }

            updateData = {
                $set: {
                    'upi.$.upiName': upiName,
                    'upi.$.barCodeImage': imageUrl,
                    updatedAt: Date.now()
                }
            };

            await adminAccountDetails.updateOne(
                { adminId: id, 'upi.upiId': upiId },
                updateData
            );
        }

        return res.status(200).send({
            statusCode: 200,
            status: "Success",
            msg: "Account details updated successfully."
        });

    } catch (error) {
        console.error("Error in updateAdminAccountDetail:", error);
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "An error occurred while processing your request.",
        });
    }
};

module.exports = { addAdminAccountDetail, createSubAdminFn, subAdminList, usersCreatedBySubAdmin, gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, gamesList, addAmount, paymentHistory, addRules, updateRules, deleteRules, getRules, updateRulesStatus, checkToken, adminAccountsList,deleteAdminAccountDetail,updateAdminAccountDetail }


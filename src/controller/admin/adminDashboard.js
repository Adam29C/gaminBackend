// Import required modules
const { hashPassword, comparePassword, generateRandomNumber } = require('../../helper/middleware');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const Msg = require('../../helper/messages');
const user = require('../../model/user');
const games = require("../../model/game");
const waled = require("../../model/waled");
const PaymentHistory = require('../../model/paymentHistory');
const rule = require("../../model/rule")
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
const userAndSubAdminList = async (req, res) => {
    try {
        const fetchUserList = await user.find({ createdBy: { $eq: "self" } });
        const subAdminList = await user.find();
        const response = {};
        if (fetchUserList.length > 0) {
            response.users = fetchUserList;
        } else {
            response.users = Msg.userListNotFound;
        }
        if (subAdminList.length > 0) {
            response.subAdmins = subAdminList;
        } else {
            response.subAdmins = Msg.subAdminListNotFound;
        }
        return res.status(200).send({
            status: true,
            msg: Msg.dataFound,
            data: response
        });
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
        let { gameName } = req.body;
        if (!gameName) {
            return res.status(200).send({
                status: true,
                msg: Msg.gameRequire
            });
        }
        if (Role === 0) {
            let obj = {
                gameName: gameName
            };
            let data = await Games.create(obj);
            if (data) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.gameCreatedSuccessfully
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.gameNotCreated
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

//Admin Can Update Game With The Help Of Game Id
const gamesUpdatedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { gameId, editGameName } = req.body;
        if (Role === 0) {
            let isExists = await games.findById({ _id: gameId });
            if (isExists) {
                const filter = { _id: gameId };
                const update = { $set: { gameName: editGameName } };
                await games.updateOne(filter, update);
                return res.status(200).send({
                    status: true,
                    msg: Msg.gameEditedSuccessfully
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.gameNotFound
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

//Admin Can delete Games With The Help Of Game Id
const gamesDeletedByAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { gameId } = req.body;
        if (Role === 0) {
            let gameDeleted = await games.deleteOne({ _id: gameId });
            if (gameDeleted) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.gameDeletedSuccessfully
                });
            } else {
                return res.status(200).send({
                    status: false,
                    msg: Msg.gameNotDeleted
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

//Get List Of Game
const gamesList = async (req, res) => {
    try {
        let Role = req.decoded.role;
        if (Role === 0) {
            let fetchGameList = await games.find();
            if (fetchGameList && fetchGameList.length >= 0) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.gameListFound,
                    data: fetchGameList
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
        const { userId, description } = req.body;

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
            description
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
            ruleId:ruleId
        });
        console.log(ruleDelete,'ruleDelete')

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


module.exports = { createSubAdminFn, userAndSubAdminList, usersCreatedBySubAdmin, gamesCreatedByAdmin, gamesUpdatedByAdmin, gamesDeletedByAdmin, gamesList, addAmount, paymentHistory, addRules, updateRules,deleteRules }


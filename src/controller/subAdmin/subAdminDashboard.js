// Import necessary modules and dependencies
const { hashPassword, comparePassword, generateRandomNumber, sendSMS } = require('../../helper/middleware');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const user = require("../../model/user");
const Msg = require('../../helper/messages');
const bcrypt = require('bcryptjs');
const game = require("../../model/game");

// user register by sub admin
const userRegisterBySubAdmin = async (req, res) => {
    try {
        let Role = req.decoded.role;
        let { role, name, mobileNumber, password } = req.body;
        if (Role !== 1) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: "Only Sub Admin Can Access"
            });
        }
        let checkUser = await user.findOne({ mobileNumber: mobileNumber });
        if (checkUser !== null) {
            return res.status(400).send({
                statusCode:400,
                status: "Failure",
                msg: Msg.phoneRegisterError,
            });
        } else {
            let newPassword = await hashPassword(password);
            let obj = {
                name: name,
                mobileNumber: mobileNumber,
                password: newPassword,
                code: 0,
                role:0,
                createdBy: "subAdmin"
            };
            let data = await user.create(obj);
            if (data) {
                return res.status(200).send({
                    statusCode: 200,
                    status: "Success",
                    msg: Msg.userRegisterBySubAdmin
                });
            } else {
                return res.status(400).send({
                    statusCode: 400,
                    status: "Failure",
                    msg: Msg.registerError
                });
            }
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: Msg.failure
        });
    }
};

// games Created By subAdmin
const gamesCreatedBySubAdmin = async (req, res) => {
    try {
        let { gameName } = req.body;
        let { id } = req.decoded;
        let checkUser = await subAdmin.findOne({ _id: id });
        if (checkUser.permissions.creategame) {
            let obj = {
                gameName: gameName
            };
            let data = await game.create(obj);
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
                msg: Msg.notPermissionToCreategame
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
};

// games Updated By subAdmin 
const gamesUpdatedSubAdmin = async (req, res) => {
    try {
        let { gameId, editgameName } = req.body;
        let { id } = req.decoded;
        let checkUser = await subAdmin.findOne({ _id: id });
        if (checkUser.permissions.editgame) {
            const filter = { _id: gameId };
            const update = { $set: { gameName: editgameName } };
            await game.updateOne(filter, update);
            return res.status(200).send({
                status: true,
                msg: Msg.gameEditedSuccessfully
            });
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.notPermissionToEdit
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
};

// games Deleted By subAdmin
const gameDeletedBySubAdmin = async (req, res) => {
    try {
        let { gameId } = req.body;
        let { id } = req.decoded;
        let checkUser = await subAdmin.findOne({ _id: id });
        if (checkUser.permissions.deletegame) {
            let gameDeleted = await game.deleteOne({ _id: gameId });
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
                msg: Msg.notPermissionToDelete
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
};

// subAdmin Can View The List OF All games
const gamesList = async (req, res) => {
    try {
        let { id } = req.decoded;
        let checkUser = await subAdmin.findOne({ _id: id });
        if (checkUser.permissions.viewgame) {
            let fetchgameList = await game.find();
            if (fetchgameList && fetchgameList.length >= 0) {
                return res.status(200).send({
                    status: true,
                    msg: Msg.gameListFound,
                    data: fetchgameList
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
                msg: Msg.notPermissionToViewgameList
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
};

// Function to get sub-admin profile
const getSubAdminProfileFn = async (req, res) => {
    try {
        let id = req.decoded.id;
        let isExists = await subAdmin.findOne({ _id: id });
        if (isExists && isExists !== null) {
            return res.status(200).send({
                status: true,
                msg: Msg.dataFound,
                data: isExists
            });
        } else {
            return res.status(200).send({
                status: false,
                msg: Msg.subAdminNotExists
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
};

// Function to update sub-admin profile
const updateSubAdminProfileFn = async (req, res) => {
    try {
        let id = req.decoded.id;
        let { name, mobileNumber, email, address } = req.body;
        const filter = { _id: id };
        const update = { $set: { name: name, mobileNumber: mobileNumber, email: email, address: address }, };
        let check = await subAdmin.findByIdAndUpdate(filter, update, { new: true });
        if (check) {
            return res.status(200).send({
                status: true,
                msg: Msg.profileUpdated
            });
        } else {
            return res.status(200).send({
                status: true,
                msg: Msg.profileNotUpdated
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: Msg.failure
        });
    }
};

module.exports = { userRegisterBySubAdmin, gamesCreatedBySubAdmin, gamesUpdatedSubAdmin, gameDeletedBySubAdmin, gamesList, getSubAdminProfileFn, updateSubAdminProfileFn }
// Import necessary modules and dependencies
const { hashPassword, comparePassword, generateRandomNumber, sendSMS } = require('../../helper/middleware');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const user = require("../../model/user");
const Msg = require('../../helper/messages');
const bcrypt = require('bcryptjs');
const game = require("../../model/game");


//This is the crud operation for all three modules admin, subAdmin and user

// user register by sub admin
const userRegisterBySubAdmin = async (req, res) => {
    try {
        let Role = req.decoded.info.roles;
        let { subAdminId,role, name, mobileNumber, password } = req.body;
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
                role:role,
                createdBy: subAdminId,

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

//fetch list of all user and all sub admin
const subAdminUserList = async (req, res) => {
    try {
        let role = req.decoded.info.roles;
        const { subAdminId } = req.query;
        if (role !== 1) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!subAdminId) {
            return res.status(500).send({
                statusCode: 500,
                status: "Failure",
                msg: "Admin Id is required"
            });
        }

        const subAdminUserData = await user.find({ createdBy: subAdminId,isDeleted:false });
        let arrVal = [];
        for (let details of subAdminUserData) {
            arrVal.push({
                name: details.name,
                mobileNumber: details.mobileNumber,
                isVerified: details.isVerified,
                createdBy: details.createdBy,
                loginStatus: details.loginStatus,
                role: details.role,
                isDeleted: details.isDeleted,
                createdAt: details.createdAt,
                userId:details._id  
            },

            )
        }
        if (subAdminUserData) {
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

const countDashboardUser = async (req, res) => {
    try {
        const role = req.decoded.info.roles;
        const { subAdminId } = req.query;

        if (role !== 0) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                msg: "subAdmin can access only."
            });
        }

        const adminDetails = await user.findOne({ _id: subAdminId });

        if (!adminDetails) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: "Sub Admin does not exist."
            });
        }

        const counts = await user.aggregate([
            {
                $match: {
                    createdBy: subAdminId
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
        const totalCount=verifiedCount+notVerifiedCount

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
        console.error(error);
        return res.status(500).send({
            statusCode: 500,
            status: "Failure",
            msg: "Internal Server Error"
        });
    }
}

// games Created By subAdmin
const gamesCreatedBySubAdmin = async (req, res) => {
    try {
        let { gameName } = req.body;
        let  id  = req.decoded.info.roles;
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

//Fetch  All Permissions Sub Admin
const subAdminPermissions = async (req, res) => {
    try {
        let role = req.decoded.info.roles;
        const { subAdminId } = req.query;
        if (role !== 1) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!subAdminId) {
            return res.status(500).send({
                statusCode: 500,
                status: "Failure",
                msg: "Admin Id is required"
            });
        }
        const data= await user.findOne({_id:subAdminId});
        if (data) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg:"SubAdmin Permissions Show Successfully",
                data: data.permissions
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

// Delete sub Admin user 
const deleteSubAdminUser = async (req, res) => {
    try {
        const  role  = req.decoded.info.roles;
        const { subAdminId, id } = req.body
        if (role !== 1) {
            return res.status(403).send({
                statusCode: 403,
                status: "Failure",
                msg: Msg.adminCanAccess
            });
        }
        if (!subAdminId || !id) {
            return res.status(400).send({
                statusCode: 400,
                status: "Failure",
                msg: 'subAdminId and id  is required'
            });
        }
        const deleteSubAdminUserData = await user.updateOne(
            {_id: id},{$set:{isDeleted:true}}
        );
        if (deleteSubAdminUserData) {
            return res.status(200).send({
                statusCode: 200,
                status: "Success",
                msg: "User Deleted Successfully"
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

module.exports = { userRegisterBySubAdmin, gamesCreatedBySubAdmin, gamesUpdatedSubAdmin, gameDeletedBySubAdmin, gamesList, getSubAdminProfileFn, updateSubAdminProfileFn,subAdminPermissions,subAdminUserList,deleteSubAdminUser,countDashboardUser }
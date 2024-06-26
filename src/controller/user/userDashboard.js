// Import necessary modules and dependencies
const {
  hashPassword,
  generateRandomNumber,
  sendSMS,
} = require("../../helper/middleware");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const Msg = require("../../helper/messages");
const bcrypt = require("bcryptjs");
const deposit = require("../../model/deposit");
const withdrawal = require("../../model/withdrawal");
const game = require("../../model/game");
const path = require('node:path');
var fs = require('file-system');
const paymentHistory = require("../../model/paymentHistory");
const wallet = require("../../model/waled");
const user = require("../../model/user")
const AccountDetail = require("../../model/accountDetails");
const adminAccountDetails = require("../../model/adminAccountDetails");
const { UserDefinedMessageInstance } = require("twilio/lib/rest/api/v2010/account/call/userDefinedMessage");
const mongoose = require('mongoose');
const paymentRequest = require("../../model/paymentRequest");
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
// user can create withdrawalCreatePassword
const withdrawalCreatePassword = async (req, res) => {
  try {
    let { userId, withdrawalPassword } = req.body;

    // Validate userId and withdrawalPassword
    if (!userId || !withdrawalPassword) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "UserId and withdrawalPassword are required."
      });
    }

    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.userNotExists
      });
    };

    if (findUser.isWithdraw) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Password Is Already Created"
      });
    }


    let newPassword = await hashPassword(withdrawalPassword);

    const updatedUser = await user.updateOne(
      { _id: userId },
      { $set: { withdrawalPassword: newPassword, isWithdraw: true, knowWithdrawalPassword: withdrawalPassword } }
    );
    if (updatedUser) {
      return res.status(201).send({
        statusCode: 201,
        status: "Success",
        msg: Msg.passwordGeneratedSuccessfully,
      });
    } else {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.somethingWentWrong
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

// user can create withdrawalCreatePassword
const withdrawalPasswordSendOtp = async (req, res) => {
  try {
    let { mobileNumber } = req.body;

    // Validate mobileNumber
    if (!mobileNumber) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Mobile number is required."
      });
    }

    const findUser = await user.findOne({ mobileNumber: mobileNumber });
    if (!findUser) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.userNotExists
      });
    }

    const randomNumber = await generateRandomNumber(1000, 2000);
    await user.updateOne(
      { mobileNumber: mobileNumber },
      { $set: { otp: randomNumber } }
    );
    await sendSMS(mobileNumber, randomNumber);

    return res.status(200).send({
      statusCode: 200,
      status: "Success",
      msg: Msg.otpSend
    });
  } catch (error) {
    return res.status(500).send({
      statusCode: 500,
      status: "Failure",
      msg: Msg.failure,
    });
  }
};

// Create withdrawalCreatePassword
const withdrawalPasswordVerifyOtp = async (req, res) => {
  try {
    let { mobileNumber, otp, password } = req.body;

    // Validate mobileNumber
    if (!mobileNumber || !otp || !password) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Mobile number,otp and password is required."
      });
    }

    const findUser = await user.findOne({ mobileNumber: mobileNumber });
    if (!findUser) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.userNotExists
      });
    }
    const code = parseInt(findUser.otp);
    if (otp !== code) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.wrongOtp
      });
    }
    let newPassword = await hashPassword(password);
    const filter = { mobileNumber: mobileNumber };
    const update = { $set: { withdrawalPassword: newPassword, knowWithdrawalPassword: password, } };
    const check = await user.updateOne(filter, update);
    if (check) {
      return res.status(200).send({
        statusCode: 200,
        status: "Success",
        msg: Msg.passwordResetSuccessfully
      });
    } else {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.somethingWentWrong
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

//Add Account Details
const addAccountDetail = async (req, res) => {
  try {
    const { userId, isBank, accountNumber, ifscCode, bankName, upiId, upiName, password } = req.body;

    // Validate userId, password, and isBank field
    if (!password || !userId || typeof isBank === 'undefined') {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "User ID, Password, and isBank field are required."
      });
    }

    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "User does not exist."
      });
    }

    const oldPassword = findUser.withdrawalPassword;

    if (oldPassword === undefined) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Pleaes Create The User withdrawal Password"
      });
    }

    const checkPassword = await bcrypt.compare(password, oldPassword);
    if (!checkPassword) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "Password does not match."
      });
    }

    // Check for existing accountNumber or upiId
    if (accountNumber) {
      const existingAccount = await AccountDetail.findOne({
        userId: userId,
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
      const existingUpi = await AccountDetail.findOne({
        userId: userId,
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

    let updateData = {};
    if (isBank) {
      updateData = { $push: { bank: { accountNumber, ifscCode, bankName, isBank } }, $set: { updatedAt: Date.now() } };
    } else {
      updateData = { $push: { upi: { upiId, upiName, isBank } }, $set: { updatedAt: Date.now() } };
    }

    // Find the existing account details document or create a new one
    await AccountDetail.findOneAndUpdate(
      { userId: userId },
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

//Add Account Details
const userAccountDetail = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "User ID is required."
      });
    }

    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: Msg.userNotExists
      });
    }

    const accountInfo = await AccountDetail.find({ userId: userId });
    let obj = {
      userId: accountInfo[0].userId,
      bankList: accountInfo[0].bank,
      upiList: accountInfo[0].upi
    }

    if (accountInfo) {
      return res.status(200).send({
        statusCode: 200,
        status: "Success",
        msg: Msg.userAccountDetail,
        data: obj
      });
    } else {
      return res.status(200).send({
        statusCode: 200,
        status: "Success",
        msg: Msg.userAccountDetail,
        data: []
      });
    }
  } catch (error) {
    return res.status(500).send({
      statusCode: 500,
      status: "Failure",
      msg: Msg.failure,
      error: error.message
    });
  }
};

//delete Account Details
const deleteAccountDetail = async (req, res) => {
  try {
    const { userId, isBank, id } = req.body;

    // Check if the user exists
    const findUser = await user.findOne({ _id: userId });
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

    const result = await AccountDetail.updateOne(
      { userId: userId }, query
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

//Add withdraw request
const withdrawPayment = async (req, res) => {
  try {
    const { userId, amount, isBank, accountId,depositWithdrawId } = req.body;

    // Validate input
    if (!userId || !amount || typeof isBank === 'undefined' || !accountId ||!depositWithdrawId) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failure",
        message: "Please provide valid data: userId, amount, isBank, and accountId are required."
      });
    }

    const userInfo = await user.findOne({ _id: userId });
    if (!userInfo) {
      return res.status(404).json({
        statusCode: 404,
        status: "Failure",
        msg: Msg.userNotExists
      });
    }

    const walletInfo = await wallet.findOne({ userId: userId });
    if (!walletInfo || walletInfo.amount < amount) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failure",
        msg: Msg.insufficientFound,
      });
    }

    const updateDebitBuffer = walletInfo.debitBuffer + amount;
    await wallet.updateOne({ userId }, { $set: { debitBuffer: updateDebitBuffer } });
    const randomUtrNumber = await generateRandomNumber(100000000,80000000);

    let paymentHistoryId=await new paymentHistory({
      userId: userId,
      accountId: accountId,
      isBank: isBank,
      amount: amount,
      paymentStatus: "debit",
      utr:randomUtrNumber,
      depositWithdrawId:depositWithdrawId
    }).save();

    await new paymentRequest({
      userId: userId,
      amount: amount,
      utr: randomUtrNumber,
      paymentStatus: "debit",
      paymentHistoryId:paymentHistoryId._id, 
      depositWithdrawId:depositWithdrawId
    }).save();

    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      msg: Msg.addFountRequest
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "Failure",
      msg: Msg.failure,
    });
  }
};

//User Waled Information  
const viewWallet = async (req, res) => {
  try {
    let { userId } = req.query;
    let findInfo = await wallet.findOne({ userId: userId });
    if (findInfo) {
      return res.status(200).json({
        status: true,
        message: Msg.waledInformation,
        WalledInfo: findInfo
      });
    } else {
      return res.status(400).json({
        status: false,
        message: Msg.noWaledInformation,
        WalledInfo: 0
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: false,
      message: Msg.failure
    });
  }
};

//User All Transaction History  
const viewPaymentHistory = async (req, res) => {
  try {
    let { userId } = req.query;
    let findInfo = await paymentHistory.findOne({ userId: userId });
    if (findInfo) {
      return res.status(200).json({
        status: "Success",
        message: Msg.userTransactionHistory,
        paymentInfo: findInfo
      });
    } else {
      return res.status(400).json({
        status: "Failure",
        message: Msg.noTransactionFound,
        WalledInfo: []
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      status: "Failure",
      message: Msg.failure
    });
  }
};

// User All Transaction History  based on credit or debit  
const filterPaymentHistory = async (req, res) => {
  try {
    let { userId, paymentstatus, date, sortField, sortOrder } = req.body;

    // Validate userId and paymentStatus
    if (!userId || !paymentstatus) {
      return res.status(400).json({
        status: "Failure",
        message: "User ID and payment status are required."
      });
    }

    // Validate and parse date if provided
    let dateObj;
    if (date) {
      dateObj = moment(date, "DD/MM/YYYY").startOf('day'); // Parse and set to start of the day
      if (!dateObj.isValid()) {
        return res.status(400).json({
          status: "Failure",
          message: "Invalid date format."
        });
      }
    }

    // Build query object
    let query = { userId: userId };
    if (paymentstatus !== "all") {
      query.paymentStatus = paymentstatus;
    }
    if (dateObj) {
      query.updatedAt = {
        $gte: dateObj.toDate(),
        $lt: dateObj.add(1, 'days').toDate() // Get all records within that day
      };
    }

    // Set default sorting parameters if not provided
    if (!sortField) {
      sortField = 'updatedAt';
    }
    if (!sortOrder) {
      sortOrder = 'desc';
    }

    // Construct sort object
    let sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Find payment history with the constructed query and sort order
    let findInfo = await paymentRequest.find(query).sort(sort);

    if (findInfo.length > 0) { // Check if any records are found
      return res.status(200).json({
        statusCode: 200,
        status: "Success",
        message: Msg.userTransactionHistory,
        paymentInfo: findInfo
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        status: "Failure",
        message: Msg.noTransactionFound,
        paymentInfo: []
      });
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({
      statusCode: 500,
      status: "Failure",
      message: Msg.failure,
    });
  }
};

//add credit request
const addCreditRequest = async (req, res) => {
  try {
    const { userId, amount, utr, isBank,depositWithdrawId } = req.body;
    if (!userId || !amount || !utr||!depositWithdrawId) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Please provide valid data: userId and amount,utr, depositId are required"
      });
    }

    const userInfo = await user.findOne({ _id: userId });
    if (userInfo) {
      const walletInfo = await wallet.findOne({ userId: userId });

      if (walletInfo) {
        let finalAmount = Number(amount);
        const updateCreditBuffer = walletInfo.creditBuffer + finalAmount;

        await wallet.updateOne({ userId }, { $set: { creditBuffer: updateCreditBuffer } });

        const paymentObj = {
          userId: userId,
          amount: finalAmount,
          paymentStatus: "credit",
          utr: utr,
          isBank: isBank,
          depositWithdrawId:depositWithdrawId
        };

        const paymentHistoryId = await paymentHistory.create(paymentObj);

        let image = null;
        if (req.file) {
          image = req.file.location
        }
        const paymentReqObj = {
          userId: userId,
          amount: finalAmount,
          utr: utr,
          imageUrl: image,
          paymentStatus: "credit",
          paymentHistoryId: paymentHistoryId._id,
          depositWithdrawId:depositWithdrawId
        };
        await paymentRequest.create(paymentReqObj);
        return res.status(200).json({
          statusCode: 200,
          status: "Success",
          msg: Msg.addFountRequest
        });
      } else {
        return res.status(400).json({
          statusCode: 400,
          status: "Failure",
          msg: Msg.insufficientFound,
        });
      }
    } else {
      return res.status(404).json({
        statusCode: 404,
        status: "Failure",
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      msg: error.message,
    });
  }
};

// user Can View The List Of All Games
const gamesList = async (req, res) => {
  try {
    let fetchGameList = await game.find();
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
  } catch (error) {
    return res.json(500).send({
      statusCode: 500,
      status: false,
      msg: Msg.failure
    })
  }
};

//series list third party api data
const seriesList = async (req, res) => {
  try {
    const { sportsId } = req.body;
    return res.json(200).send({
      status: true,
      list: []
    })

  } catch (error) {
    return res.json(500).send({
      statusCode: 500,
      status: false,
      msg: Msg.failure
    })
  }
};

//Match list third party api data
const matchList = async (req, res) => {
  try {
    const { seriesId } = req.body;
    res.json(200).send({
      status: true,
      list: []
    })
  } catch {
    res.json(500).send({
      status: false,
      msg: Msg.failure
    })
  }
};

//Get All Admin Account List
const adminAccountsList = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send({
        statusCode: 400,
        status: "Failure",
        msg: "userId is required",
      });
    }

    const accountDetails = await adminAccountDetails.find({ role: 0 });

    if (!accountDetails || accountDetails.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        status: "Failure",
        msg: "No account details found for the given userId",
      });
    }

    const accountDetail = accountDetails[0];

    const obj = {
      adminId: accountDetail.adminId,
      bankList: accountDetail.bank,
      upiList: accountDetail.upi
    };

    return res.status(200).send({
      statusCode: 200,
      status: "Success",
      msg: "Admin accounts list retrieved successfully",
      data: obj
    });

  } catch (error) {
    console.error("Error in adminAccountsList:", error);
    return res.status(500).send({
      statusCode: 500,
      status: "Failure",
      msg: "An error occurred while processing your request",
    });
  }
};

//Get Account By Id(Admin Account Info)
const accountById = async (req, res) => {
  try {
    const { userId, isBank, id } = req.body;
    if (!userId || !id) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failure",
        message: "Please provide valid data: userId and id are required"
      });
    }

    const userDetails = await user.findOne({ _id: userId });
    if (!userDetails) {
      return res.status(400).json({
        statusCode: 400,
        status: "Failure",
        message: "User does not exist"
      });
    }

    const objectIdAccountId = new ObjectId(id); // Ensure id is an ObjectId
    let query;
    if (isBank) {
      query = {
        'bank._id': objectIdAccountId
      };
    } else {
      query = {
        'upi._id': objectIdAccountId
      };
    }

    const accountDetails = await adminAccountDetails.findOne(query);
    if (!accountDetails) {
      return res.status(404).json({
        statusCode: 404,
        status: "Failure",
        message: "Account details not found"
      });
    }

    let specificAccountDetails = null;
    if (isBank) {
      specificAccountDetails = accountDetails.bank.find(account => account._id.equals(objectIdAccountId));
    } else {
      specificAccountDetails = accountDetails.upi.find(account => account._id.equals(objectIdAccountId));
    }

    if (!specificAccountDetails) {
      return res.status(404).json({
        statusCode: 404,
        status: "Failure",
        message: "Account details not found"
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: "Success",
      message: "Account details retrieved successfully",
      data: specificAccountDetails
    });

  } catch (error) {
    console.error("Error in accountById:", error);
    return res.status(500).json({
      statusCode: 500,
      status: "Failure",
      message: "An error occurred while processing your request"
    });
  }
};

module.exports = { withdrawalCreatePassword, gamesList, seriesList, matchList, viewWallet, withdrawPayment, viewPaymentHistory, withdrawalPasswordSendOtp, withdrawalPasswordVerifyOtp, addAccountDetail, userAccountDetail, deleteAccountDetail, addCreditRequest, filterPaymentHistory, accountById, adminAccountsList };

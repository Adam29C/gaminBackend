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

// user Can deposit There Money With The Help Of Utr Number
const depositFn = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let { utrNumber, amount } = req.body;
    if (!req.file) {
      return res.status(200).send({
        status: true,
        msg: 'File is required'
      });
    }
    let image = req.file;
    let folderName = "fileUrl";
    const currentDirectory = path.resolve();
    const folderPath = path.join(currentDirectory, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const imageUrl = image.path;
    const fileName = image.originalname + '-' + Date.now() + '.txt';
    const filePath = path.join(folderPath, fileName);
    fs.writeFile(filePath, imageUrl, async (err) => {
      if (err) {
        console.error('Error writing image URL to file:', err);
      } else {
        let obj = {
          utrNumber: utrNumber,
          amount: amount,
          file: imageUrl,
          userId: userId
        };
        let data = await deposit.insertMany(obj)
        if (data) {
          return res.status(200).send({
            status: true,
            msg: Msg.amountDepositSuccess,
            data: data
          });
        } else {
          return res.status(200).send({
            status: false,
            msg: Msg.amountNotDeposit
          });
        }
      }
    });
  } catch (error) {
    return res.json(500).send({
      statusCode: 500,
      status: false,
      msg: Msg.failure
    })
  }
};

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

    const randomNumber = await generateRandomNumber(10000, 20000);
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

// user can create withdrawalCreatePassword
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

// user can withdraw the amount
const withdraw = async (req, res) => {
  try {
    let { userId, password } = req.body;
    let isExists = await withdrawal.findOne({ userId: userId });
    if (isExists) {
      let pass = isExists.password;
      let checkPassword = await bcrypt.compare(password, pass);
      if (checkPassword) {
        return res.status(200).send({
          status: true,
          msg: Msg.success,
        });
      } else {
        return res.status(200).send({
          status: false,
          msg: Msg.inValidPassword
        });
      }
    } else {
      return res.status(200).send({
        status: false,
        msg: Msg.passwordGenerated
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

//Add withdraw request
const withdrawPayment = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Please provide valid data: userId and amount are required"
      });
    }
    const userInfo = await user.findOne({ _id: userId });
    if (userInfo) {
      const walletInfo = await wallet.findOne({ userId: userId });
      if (walletInfo.amount >= amount) {
        const updateAmt = walletInfo.amount - amount;
        const updateDebitBuffer = walletInfo.debitBuffer + amount;
        await wallet.updateOne({ userId }, { $set: { amount: updateAmt, debitBuffer: updateDebitBuffer } })
        await new paymentHistory({
          userId: userId,
          amount: amount,
          paymentStatus: "debit",
        }).save();
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
    }
  } catch (error) {
    return res.status(500).json({
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

module.exports = { depositFn, withdrawalCreatePassword, withdraw, gamesList, seriesList, matchList, viewWallet, withdrawPayment, viewPaymentHistory, withdrawalPasswordSendOtp, withdrawalPasswordVerifyOtp }

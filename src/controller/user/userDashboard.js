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
    return res.status(400).send({
      status: false,
      msg: error.message
    });
  }
};

// user can create withdrawalCreatePassword
const withdrawalCreatePassword = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let { password } = req.body;
    let newPassword = await hashPassword(password);
    let obj = {
      password: newPassword,
      userId: userId
    };
    let data = await withdrawal.insertMany(obj)
    if (data) {
      return res.status(200).send({
        status: true,
        msg: Msg.passwordGeneratedSuccessfully,
      });
    } else {
      return res.status(200).send({
        status: false,
        msg: Msg.passwordNotGenerated
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      msg: error.message
    });
  }
};

// user can withdraw the amount
const withdraw = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let { password } = req.body;
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
    return res.status(400).send({
      status: false,
      msg: error.message
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
    return res.status(400).send({
      status: false,
      msg: error.message
    });
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

//User Waled Information  
const viewWallet = async (req, res) => {
  try {
      let userId = req.decoded.info.userId;
      let findInfo = await paymentHistory.findOne({ userId: userId });
      if (findInfo) {
          return res.status(200).json({
              status: true,
              message: Msg.waledInformation,
              WalledInfo: findInfo
          });
      } else {
          return res.status(400).json({
              status: false,
              message:Msg.noWaledInformation,
              WalledInfo: []
          });
      }
  } catch (error) {
      return res.status(500).json({
          status: false,
          message: error.message
      });
  }
};

module.exports = { depositFn, withdrawalCreatePassword, withdraw, gamesList, seriesList, matchList, viewWallet }

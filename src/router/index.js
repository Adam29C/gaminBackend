const express = require('express') 
const router = express.Router()
const gaming = require('./gaming');
const webData = require("./web")
router.use('/userRouter', require('./userRouter'))
router.use('/adminRouter', require('./adminRouter'))
router.use('/subAdminRouter', require('./subAdminRouter'))
router.use('/authRouter', require('./authRouter'));
router.use("/common",require('./common'))
router.use('/sports',gaming);
router.use("/webData",webData)

module.exports = router

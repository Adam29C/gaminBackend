const express = require('express') 
const router = express.Router()
const gaming = require('./gaming');

router.use('/userRouter', require('./userRouter'))
router.use('/adminRouter', require('./adminRouter'))
router.use('/subAdminRouter', require('./subAdminRouter'))
router.use('/authRouter', require('./authRouter'));
router.use("/common",require('./common'))
router.use('/sports',gaming)

module.exports = router

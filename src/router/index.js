const express = require('express') 
const router = express.Router()

router.use('/userRouter', require('./userRouter'))
router.use('/adminRouter', require('./adminRouter'))
router.use('/subAdminRouter', require('./subAdminRouter'))
router.use('/authRouter', require('./authRouter'))

module.exports = router

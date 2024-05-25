const accountDetails = require("../model/accountDetails");

// Define your messages
const messages = {
    emailExists: "This Email Already Register",
    registerSuccess: "Register Successfully",
    registerError: 'Not Register',
    welcome: 'Welcome to our application!',
    err: "Something Went Wrong",
    success: 'Operation completed successfully.',
    otpVerified: "Otp Verified",
    wrongOtp: "Wrong Otp",
    allReadyOtpVerified: 'Otp already Verified',
    dataFound: 'Data Found Successfully',
    dataNotFound: "Data Not Found",
    otpSend: "Otp Send Successfully",
    otpNotSend: "Otp Not Send",
    loggedIn: 'Login Successfully',
    inValidPhone: 'Invalid Phone Number',
    inValidPassword: "Invalid Password",
    phoneRegisterSuccess: "Phone Number Register Successfully",
    phoneRegisterError: "Phone Number Already Register",
    phoneNotRegister: "Phone Number Not Register",
    amountDepositSuccess: "Amount Deposit successfully",
    amountNotDeposit: "Amount Not Deposit",
    passwordGenerated: "Generate Your Password",
    passwordGeneratedSuccessfully: "Your Withdrawal Password Generated Successfully",
    passwordNotGenerated: "Password Not Generated",
    userProfileFoundSuccess: "User Profile Found Successfully",
    userProfileNotFound: "User Profile Not Found",
    passwordResetSuccessfully: "Your Password Has Been Reset Successfully",
    passwordNotReset: "Your Password Could Not Be Reset",
    subAdminNotExists: "Sub-Admin Not Exists",
    pwdNotChange: "Password Not Change",
    pwdChangeSuccessfully: "Password Change Successfully",
    adminCanAccess: "Only Admin Can Access",
    verifiedPhoneNumber: "Phone Number Verified Successfully",
    allReadyVerifiedNumber: "Phone Number Already Verified ",
    phoneNumberNotVerified: "Phone Number Is Not Verified",
    userRegisterBySubAdmin: "User Successfully Created By Sub Admin",
    subAdminListFoundSuccessfully: "SubAdmin List Found Successfully",
    subAdminListNotFound: "SubAdmin Not Found",
    userListFoundSuccessfully: "User List Found Successfully",
    userListNotFound: "No User Found",
    idRequire: "Id Must Be Require",
    gameCreatedSuccessfully:"Game Created Successfully",
    gameNotCreated:"Game Not Created",
    gameRequire:"Game Must Be Required",
    gameEditedSuccessfully:"Game Update Successfully",
    gameNotFound:"Game Not Found",
    gameDeletedSuccessfully:"Game Deleted Successfully",
    gameNotDeleted:"Game Not Deleted",
    gameListFound:"Game List Found Successfully",
    notPermissionToCreateGame:"You Don't Have Permission To Create Any Game",
    notPermissionToEdit:"You Don't Have Permission To Edit Any Game",
    notPermissionToDelete:"You Don't Have Permission To Delete Any Game",
    notPermissionToViewGameList:"You Don't Have Permission To View Any Game",
    userNotCreatedBySubAdmin:"User Not Created By Sub-Admin",
    profileUpdated:"Profile Updated Successfully",
    profileNotUpdated:"Profile Not Updated",
    pwdAndCnfPwdNotMatch:"Password And Confirm Password Not Match",
    pwdChangSuccess:"Password Change Successfully",
    pwdNotChang:"Password Not Change",
    userNotExists:"User Not Exists",
    userAccountDetail:"User Account Detail Show Successfully",
    accountDetailsNotFound:"No Account Details Is Found",
    userRegister:"User Register Successfully",
    somethingWentWrong:"Something Went Wrong",
    mobileAlreadyInUse:"Mobile number already in use",
    infoNotFound:"Failed to retrieve user information",
    failure:"Internal Server Error",
    detailNotfound:"The Detail Not Found ",
    amountAdded:"Amount Added Successfully",
    paymentHistory:"Payment History Shown Successfully",
    waledInformation:"Waled Information Shown Successfully",
    noWaledInformation:"There is no information available",
    invalidToken:"Invalid Token",
    tokenNotfound:"Token Not Found",
    pleaseProvideToken:"Please provide a token",
    addFountRequest:"Fund Request Add Successfully",
    insufficientFound:"Insufficient Found please Try Another Amount",
    noTransactionFound:"No Transaction found",
    userTransactionHistory:"All Transaction History Show Successfully",
    accountDetailsSave:"Account Details Save Successfully",
    rulesAddedSuccessfully:'Rule Added successfully',
    ruleUpdate:"Rule Update Successfully",
    ruleNotFound:"Rule Not Found",
    ruleUpdateSuccessfully:"Rule updated successfully",
    statusUpdateSuccessfully:"Status Update Successfully",
    allRulesFound:"All Rules Show Successfully",
    rulesDeleteSuccessfully:"Rules Delete Successfully",
    adminAccountsList:"Admin All Account Details.",
    accountUpdate:"Account Update Successfully",
    upiAccountIdNotExist:"UPI account ID does not exist.",
    bankAccountIdNotExist:"Bank account ID does not exist."
};

// Export the messages
module.exports = messages;
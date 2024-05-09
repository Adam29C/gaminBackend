const  authController  = require('./authController');

// Create an object to hold references to userController and adminController and subAdminDashboard
const controller = {
    authController: authController
};

module.exports = controller; 

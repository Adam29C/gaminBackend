const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('../model/user')

async function seedAdmin() {
    await mongoose.connect(process.env.MONGODBURI, {
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    });
    const existingAdmin = await user.findOne({role:1})
    if (!existingAdmin) {
        const adminCredentials = {
            name: "super admin",
            mobileNumber: 1234567890,
            role: 0,
            password: "superAdmin123",
            knowPassword: "superAdmin123",
            isVerified:true
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);
        adminCredentials.password = hashedPassword;

        let adminCreate = await user.create(adminCredentials)
    }
}

seedAdmin().then(()=>{
    process.exit(0);
}).catch((err)=>{
    process.exit(1);
})

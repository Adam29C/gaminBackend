// Import nodemailer module
const nodemailer = require('nodemailer');

// Define a function named 'mail' to send an email with OTP
module.exports.mail = async function (email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        port: 465, 
        secure: true, 
        logger: true, 
        debug: true, 
        secureConnection: false,
        auth: {
            user: 'shubhammandloi.ems@gmail.com',
            pass: 'guneotzyypycrtpj',
        },
        tls: {
            rejectUnauthorized: true 
        }
    });

    // Define email options
    let mailOptions = {
        from: "kpatel74155@gmail.com", // Sender email address
        to: email, // Receiver email address
        subject: 'This Mail Is Form e-commerce Project', // Email subject
        html: `This Is Your Otp ${otp} Please Don’t share your OTP, keep your account protected ` // Email content with OTP
    };

    // Send email using transporter
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) { // If error occurs while sending email
            console.log("Error " + err); // Log the error
        } else { // If email sent successfully
            console.log("Email sent successfully", info.response); // Log the success message with email response info
        }
    });

}

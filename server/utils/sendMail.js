const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

// async..await is not allowed in global scope, must use a wrapper
const sendMail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Shop_E-commerce" <no-reply@Shop_E-commerce.email>', // sender address
        to: email, // list of receivers
        subject: 'Forgot password', // Subject line
        html: html, // html body
    });

    return info;
});

module.exports = sendMail;

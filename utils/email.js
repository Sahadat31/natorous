const nodemailer = require('nodemailer');

const email = async(options)=> {
    // transporter are the service that is used as transport to send emails
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    // mail configuration
    const mailOptions = {
        from:'SAHADAT HOSSAIN <hossain.sahadat.inf@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions)
}
module.exports = email;
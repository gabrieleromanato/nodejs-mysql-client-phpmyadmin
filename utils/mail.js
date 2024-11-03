'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
    }
});

const send = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: process.env.MAILFROM,
            to,
            subject,
            text,
            html
        });
        console.log('Mail sent successfully');
    } catch (error) {
        console.error('Error sending mail:', error);
    }
};

module.exports = { send };
require('dotenv').config();
import { createTransport } from 'nodemailer';

const service = process.env.MAIL_SERVICE;
const user = process.env.MAIL_USERNAME;
const pass = process.env.MAIL_PASS;

const transporter = createTransport({
    service,
    auth: {
        user,
        pass
    }
})

export const sendMail = async (to, subject, text = null, html = null) => {

    const mailOptions = {
        from: user,
        to,
        subject,
        ...(text ? { text } : { }),
        ...(html ? { html } : { })
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}
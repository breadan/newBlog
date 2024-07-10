import nodemailer from 'nodemailer';
import { htmlCode } from '../utils/html.js';
import jwt from 'jsonwebtoken';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.APP_EMAIL_ADDRESS, // sender address
      to: options.email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: htmlCode(options.api), // html body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log(err);
  }
};

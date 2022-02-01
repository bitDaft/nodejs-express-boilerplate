import nodemailer from 'nodemailer';

import config from '#config';

let transporter = nodemailer.createTransport(config.smtp);

export const sendEmail = async (to, subject, html, from) => {
  return transporter.sendMail({ from, to, subject, html });
};

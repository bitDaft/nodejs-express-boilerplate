import nodemailer from 'nodemailer';

import config from '#config';

const transporter = nodemailer.createTransport(config.smtp);

const sendMail = async (data) => {
  return transporter.sendMail(data);
};

export default sendMail;

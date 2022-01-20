import nodemailer from "nodemailer";

import config from "#config";

const SMTPconfig = {
  host: config.SMTP_host,
  port: config.SMTP_port,
  auth: {
    user: config.SMTP_user,
    pass: config.SMTP_pass,
  },
};

let transporter = nodemailer.createTransport(SMTPconfig);

export const sendEmail = async (to, subject, html, from) => {
  return transporter.sendMail({ from, to, subject, html });
};

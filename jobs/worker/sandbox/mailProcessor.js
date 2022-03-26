import nodemailer from 'nodemailer';

import config from '#config';

const transporter = nodemailer.createTransport(config.smtp);

const mailJobProcessor = async (job) => {
  const data = job.data;
  return transporter.sendMail(data);
};

export default mailJobProcessor;

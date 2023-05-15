import sendMail from '#utils/sendMail';

const mailJobProcessor = async (job) => {
  return sendMail(job.data);
};

export default mailJobProcessor;

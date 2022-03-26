const generalJobProcessor = async (job) => {
  const data = job.data;
  // ^define your general job names to be processed here
  switch (job.name) {
    case 'task1':
      return data;
    case 'task2':
      return data;
    case 'task3':
      return data;
    default:
      return data;
  }
};

export default generalJobProcessor;

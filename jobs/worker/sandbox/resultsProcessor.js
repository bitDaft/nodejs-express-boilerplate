const resultsJobProcessor = async (job) => {
  const data = job.data;
  // ^define your results job types to be processed here
  switch (data.type) {
    case 'resultType1':
      return data;
    case 'resultType2':
      return data;
    case 'resultType3':
      return data;
    default:
      return data;
  }
};

export default resultsJobProcessor;

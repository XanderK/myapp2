const fsPromises = require('fs').promises;

module.exports.sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
  };
    
module.exports.doesFileExist = async (fullFileName) => {
  try {
    await fsPromises.access(fullFileName, fs.constants.F_OK);
  }
  catch(e) {
    return false;
  }
  return true;
};

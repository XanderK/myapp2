module.exports.sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};
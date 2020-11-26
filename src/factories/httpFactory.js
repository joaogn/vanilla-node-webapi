const HttpService = require("../services/httpService");

const generateInstance = () => {
  const httpService = new HttpService();

  return httpService;
};

module.exports = { generateInstance };

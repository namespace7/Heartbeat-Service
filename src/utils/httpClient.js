const axios = require("axios");
const { DEFAULT_TIMEOUT, USER_AGENT } = require("../config/constants");

const createHttpClient = (customTimeout) => {
  return axios.create({
    timeout: customTimeout || DEFAULT_TIMEOUT,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json, text/plain, */*",
    },
  });
};

module.exports = {
  createHttpClient,
};

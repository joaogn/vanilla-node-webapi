const { request } = require("http");

module.exports = (url, options) =>
  new Promise((resolve, reject) => {
    return request(url, options, async (res) => {
      for await (const data of res) {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e.message);
        }
      }
    }).end();
  });

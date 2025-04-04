const crypto = require("crypto");

function buildUrl(baseUrl, action, queryString, secret) {
  const checksum = crypto
    .createHash("sha1")
    .update(action + queryString + secret)
    .digest("hex");

  return `${baseUrl}/bigbluebutton/api/${action}?${queryString}&checksum=${checksum}`;
}

module.exports = { buildUrl };

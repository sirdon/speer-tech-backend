const config = require("./config");
const request = require("supertest")(config.host[process.env.ENV || "development"]);
let headers = {
    "content-type": "application/json",
    token:""
};



module.exports = {
    headers: headers,
};

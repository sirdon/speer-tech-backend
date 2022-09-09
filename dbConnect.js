const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function (err) {
    if (err) {
      console.log("DB connection fail", err);
    } else {
      console.log("DB Connected successfully");
    }
  }
)

module.exports = mongoose.Schema;
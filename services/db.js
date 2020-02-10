const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
  },
  () => console.log("db connected")
);

module.exports = mongoose;

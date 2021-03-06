const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
    min: 2
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  permission: Number,
  likes: [String],
  rates: [{
    rate: Number,
    company: String
  }],
  donates: [
    {
      idCompany: String,
      count: Number
    }
  ],
  bonuses: [{
    idBonuse: String,
    idCompany: String,
    count: Number
  }],
  blocked: Boolean
});

module.exports = mongoose.model("User", userSchema);

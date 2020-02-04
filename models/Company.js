const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 128
  },
  shortDescription: {
    type: String,
    required: true,
    min: 6,
    max: 256
  },
  description: {
    type: String,
    required: true,
    min: 6,
    max: 2048
  },
  category: {
    type: String,
    required: true,
    min: 6,
    max: 64
  },
  tags: {
    type: Array,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  dateStart: {
    type: Number,
    required: true
  },
  dateEnd: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Company", companySchema);

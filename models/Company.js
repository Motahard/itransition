const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 128
  },
  owner: {
    type: String
  },
  description: {
    type: String,
    required: true,
    min: 64,
    max: 2048
  },
  category: {
    type: String,
    required: true,
    min: 6,
    max: 64
  },
  tags: [
    {
      type: String
    }
  ],
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
  },
  youtubeLink: {
    type: String
  },
  bonuses: [
    {
      name: String,
      price: Number,
      description: String
    }
  ],
  comments: [
    {
      message: String,
      username: String,
      likes: Number,
      date: Number,
      userId: String,
    }
  ],
  news: [
    {
      title: String,
      description: String,
      img: {
        URL: String,
        path: String
      },
      date: Number
    }
  ],
  rates: {
    count: Number,
    rate: Number
  }
});

module.exports = mongoose.model("Company", companySchema);

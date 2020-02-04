const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");

module.exports.createUser = async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send("Enter correct all fields");
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res
      .header("auth-token", token)
      .status(200)
      .send();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.authUser = async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("Enter correct all fields");
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email not found");
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  try {
    res
      .header("auth-token", token)
      .status(200)
      .send();
  } catch (error) {
    res.status(500).send("Server error in Auth User");
  }
};

module.exports.getUser = async function(req, res) {
  const decoded = req.user;
  const user = await User.findById(decoded._id);
  if (!user) {
    res.status(400).send("User does not exist");
  }
  const response = {
    id: user._id,
    name: user.name,
    email: user.email
  };
  try {
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Server error in Get User");
  }
};

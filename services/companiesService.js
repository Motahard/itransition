const Company = require("../models/Company");

module.exports.getCompanies = async function(req, res) {
  res.send({ hello: "hello" });
};

const Company = require("../models/Company");

module.exports.getCompanies = async function(req, res) {
  const companies = await Company.find({});
  console.log(companies);
};

module.exports.addCompany = async function(req, res) {
  const company = req.body;
  console.log(company);
};

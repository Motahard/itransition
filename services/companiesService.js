const Company = require("../models/Company");

module.exports.getCompanies = async function(req, res) {
  try {
    const companies = await Company.find({});
    if (companies) {
      res.send(companies);
    } else {
      res.status(200).send({
        message: "No one company found"
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.getCompany = async function(req, res) {
  const queryId = req.query.id;
  try {
    const company = await Company.findById(queryId);
    if (company) {
      res.send(company);
    } else {
      res.status(200).send({
        message: "Company not found"
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.addCompany = async function(req, res) {
  try {
    const company = new Company(req.body);
    await company.save();
    res.send({
      msg: "Company created"
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

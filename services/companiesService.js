const Company = require("../models/Company");
const User = require("../models/User");

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

module.exports.addNews = async function(req, res) {
  const queryId = req.query.idCompany;
  try {
    const company = await Company.findById(queryId);
    company.news.push(req.body);
    const savedCompany = await company.save();
    const response = savedCompany.news[savedCompany.news.length-1];
    res.send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.deleteNews = async function(req, res) {
  const { idNews, idCompany } = req.query;
  try {
    const company = await Company.findById(idCompany);
    company.news.remove(idNews);
    company.save();
    res.send({idNews});
  } catch (error) {
    res.status(400).send(error.message)
  }
};

module.exports.updateNews = async function(req, res) {
  const { idNews, idCompany } = req.query;
  try {
    const company = await Company.findById(idCompany);
    const founded = await Company.findOneAndUpdate({ "_id": idCompany, "news._id": idNews },
        {$set : {
            "news.$.title" : req.body.title,
            "news.$.description" : req.body.description,
            "news.$.img" : req.body.img
          } }, { "new": true}, function(err, updatedValue) {
          res.send(updatedValue.news);
        }
  );
  } catch (error) {
    res.status(400).send(error.message)
  }
};

module.exports.addCompanyRate = async function (req, res) {
  const { companyId, userId  } = req.query;
  const { rate } = req.body;
  try {
    const user = await User.findById(userId);
    const company = await Company.findById(companyId);
    let consistCompanyRateId = false;
    user.rates.forEach(r => {
      if (r.company == companyId) {
        consistCompanyRateId = true;
      }
    });

    if(!consistCompanyRateId) {
      const obj = {
        company: company.id,
        rate: rate
      };
      user.rates.push(obj);
      if(!company.rates.rate && !company.rates.count) {
        company.rates = {
          count: 1,
          rate: rate
        }
      } else {
        company.rates.count += 1;
        company.rates.rate += +rate;
      }
      const savedUser = await user.save();
      const savedCompany = await company.save();
      res.send({savedCompany, savedUser});
    } else {

      user.rates.forEach(r => {
        if (r.company == companyId) {
          const difference = rate - r.rate;
          r.rate = rate;
          company.rates.rate += +difference;
        }
      });
      const savedUser = await user.save();
      const savedCompany = await company.save();
      res.send({savedCompany, rates: savedUser.rates});
    }
  } catch (error) {
    res.status(400).send({
      message: 'add rate error'
    })
  }
};

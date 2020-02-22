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

module.exports.updateCompany = async function(req, res) {
  const { id } = req.query;
  try {
    if(req.body.gallery && req.body.gallery.length > 0) {

      const company = await Company.findById(id);
      const { title, description, tags, youtubeLink, category, amount, dateEnd, gallery } = req.body;
      company.title = title;
      company.description = description;
      company.tags = tags;
      company.youtubeLink = youtubeLink;
      company.category = category;
      company.amount = amount;
      company.dateEnd = dateEnd;
      gallery.forEach(item => {
        company.gallery.push(item);
      });
      const savedCompany = await company.save();
      res.send(savedCompany);
    } else {
      Company.findByIdAndUpdate(id, req.body, { "new": true}, function(err, updatedValue) {
        res.send(updatedValue);
      })
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.deleteImg = async function(req, res) {
  const { id, img } = req.query;
  try {
    const company = await Company.findById(id);
    company.gallery.forEach(imgObj => {
      if(imgObj._id.toString() === img) {
        imgObj.remove();
      }
    });
    const savedCompany = await company.save();
    res.send(savedCompany);
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
      res.send({savedCompany, rates: savedUser.rates});
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

module.exports.addBonuse = async function(req, res) {
  const { idCompany } = req.query;
  try {
    const company = await Company.findById(idCompany);
    company.bonuses.push(req.body);
    const savedCompany = await company.save();
    res.send(savedCompany.bonuses);
  } catch (error) {
    res.status(400).send({
      message: 'add bonuse error'
    })
  }
};

module.exports.updateBonuse = async function(req, res) {
  const { idCompany } = req.query;
  const { _id, name, description, price } = req.body;
  try {
    const company = await Company.findById(idCompany);
    company.bonuses.forEach(bonuse => {
      if (bonuse._id == _id) {
        bonuse.name = name;
        bonuse.description = description;
        bonuse.price = price;
      }
    });
    const savedCompany = await company.save();
    res.send(savedCompany.bonuses);
  } catch (error) {
    res.status(400).send({
      message: 'update bonuse error'
    })
  }
};

module.exports.deleteBonuse = async function(req, res) {
  const { idCompany, idBonuse } = req.query;
  try {
    const company = await Company.findByIdAndUpdate(idCompany, {
      $pull: { "bonuses": { _id: idBonuse  } }
    }, { new: true }, (err, node) => {
      res.send(node.bonuses);
    });
  } catch (error) {
    res.status(400).send({
      message: 'delete bonuse error'
    })
  }
};

module.exports.getTags = async function(req, res) {
  try {
    const companies = await Company.find({});
    const tags = companies.map(company => {
      return company.tags;
    });
    res.send(tags.join(',').split(","));
  }
  catch (error) {
    res.status(400).send(error);
  }
};

module.exports.searchCompanies = async function(req, res) {
  const {str} = req.query;
  try {
    const companies = await Company.find({$text: {$search: str}});
    res.send(companies);
  }
  catch (error) {
    res.status(400).send(error);
  }
};

module.exports.donateCompany = async function(req, res) {
  const {id} = req.query;
  const { sum } = req.body;
  try {
    const company = await Company.findById(id);
    company.currentAmount += +sum;
    const savedCompany = await company.save();
    res.send(savedCompany);
  }
  catch (error) {
    res.status(400).send(error);
  }
}
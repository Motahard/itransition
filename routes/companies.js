const router = require("express").Router();
const verifyToken = require("../services/verifyToken");
const Company = require('../models/Company');
const {
  getCompanies,
  addCompany,
  getCompany,
  addMessage
} = require("../services/companiesService");
const expressWs = require("../index");

router.get("/companies", getCompanies);
router.post("/companies/add", verifyToken, addCompany);
router.get("/company", getCompany);
router.post("/company/messages", verifyToken, async function(req, res) {
      const idCompany = req.query.idCompany;
      try {
        const company = await Company.findById(idCompany);
        company.comments.push(req.body);
        const saved = await company.save();
        res.send(saved.comments[saved.comments.length-1]);
      } catch (error) {
        res.status(400).send('Error while trying to add new comment');
      }
});
router.ws("/company/messages", function(ws, req, next) {
  ws.on("message", async function(msg) {
    expressWs.getWss().clients.forEach(client => {
      client.send(msg);
    });
  });
});

module.exports = router;

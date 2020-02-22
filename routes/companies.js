const router = require("express").Router();
const verifyToken = require("../services/verifyToken");
const Company = require('../models/Company');
const {
  getCompanies,
  addCompany,
  getCompany,
    addNews,
    deleteNews,
    updateNews,
    addCompanyRate,
  addBonuse,
  deleteBonuse,
  updateBonuse,
  updateCompany,
  deleteImg,
  getTags,
  searchCompanies,
  donateCompany
} = require("../services/companiesService");
const expressWs = require("../index");

router.get("/companies", getCompanies);
router.get("/companies/tags", getTags);
router.get("/companies/search", searchCompanies);
router.post("/companies/add", verifyToken, addCompany);

router.get("/company", getCompany);
router.put("/company", verifyToken, updateCompany);

router.post("/company/donate", verifyToken, donateCompany);

router.delete("/company/gallery", verifyToken, deleteImg);

router.post("/company/news", verifyToken, addNews);
router.delete("/company/news", verifyToken, deleteNews);
router.put("/company/news", verifyToken, updateNews);

router.post("/company/bonuses", verifyToken, addBonuse);
router.delete("/company/bonuses", verifyToken, deleteBonuse);
router.put("/company/bonuses", verifyToken, updateBonuse);

router.post("/company/rates", verifyToken, addCompanyRate);

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

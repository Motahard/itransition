const router = require("express").Router();
const verifyToken = require("../services/verifyToken");
const {
  getCompanies,
  addCompany,
  getCompany
} = require("../services/companiesService");

router.get("/companies", getCompanies);
router.get("/company", getCompany);
router.post("/companies/add", verifyToken, addCompany);

module.exports = router;

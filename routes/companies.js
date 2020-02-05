const router = require("express").Router();
const verifyToken = require("../services/verifyToken");
const { getCompanies, addCompany } = require("../services/companiesService");

router.get("/companies", getCompanies);
router.post("/companies/add", verifyToken, addCompany);

module.exports = router;

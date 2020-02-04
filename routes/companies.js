const router = require("express").Router();
const verifyToken = require("../services/verifyToken");
const { getCompanies } = require("../services/companiesService");

router.get("/companies", getCompanies);

module.exports = router;

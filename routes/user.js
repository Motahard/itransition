const router = require('express').Router();
const { check } = require('express-validator');

const verifyToken = require('../services/verifyToken');
const {
    getUserCompanies,
    updateUserData,
    deleteUserCompany,
    addUserLike
} = require('../services/userService');

router.get("/user/company", verifyToken, getUserCompanies);
router.put("/user", verifyToken, [
    check("name")
        .isString()
        .isLength({ min: 2, max: 255 }),
    check("email")
        .isEmail()
        .isLength({ min: 6, max: 255 }),
        ],
    updateUserData);
router.delete("/user/company", verifyToken, deleteUserCompany);
router.post("/user/likes", verifyToken, addUserLike);

module.exports = router;
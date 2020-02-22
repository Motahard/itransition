const router = require('express').Router();
const { check } = require('express-validator');

const verifyToken = require('../services/verifyToken');
const {
    getUserCompanies,
    updateUserData,
    deleteUserCompany,
    addUserLike,
    addUserDonate,
    addUserBonuse,
    getUserBonuse,
    getUsers,
    changePermission,
    deleteUser,
    blockUser
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
router.post("/user/donate", verifyToken, addUserDonate);
router.post("/user/bonuses", verifyToken, addUserBonuse);
router.post("/user/bonuses/get", verifyToken, getUserBonuse);

router.get("/users", verifyToken, getUsers);
router.delete("/users", verifyToken, deleteUser);

router.post("/users/permission", verifyToken, changePermission);
router.post("/users/block", verifyToken, blockUser);


module.exports = router;
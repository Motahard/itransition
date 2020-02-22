const router = require("express").Router();
const { check } = require("express-validator");
const { createUser, authUser, getUser, getUserById } = require("../services/authService");
const verifyToken = require("../services/verifyToken");

router.post(
  "/register",
  [
    check("name")
      .isString()
      .isLength({ min: 2, max: 255 }),
    check("email")
      .isEmail()
      .isLength({ min: 6, max: 255 }),
    check("password")
      .isString()
      .isLength({ min: 6, max: 255 })
  ],
  createUser
);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .isLength({ min: 6, max: 255 }),
    check("password")
      .isString()
      .isLength({ min: 6, max: 255 })
  ],
  authUser
);

router.get("/user", verifyToken, getUser);
router.get("/user/id", getUserById);

module.exports = router;

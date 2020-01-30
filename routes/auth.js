const router = require("express").Router();
const { check } = require("express-validator");
const { createUser, authUser } = require("../services/authService");

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

module.exports = router;

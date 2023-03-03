const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/UserController");
const userModel = require("../models/User");
const tokenMiddleware = require("../middlewares/tokenMiddleware");

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("username minimun 8 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimun 8 characters"),
  userController.signin
);

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 8 })
    .withMessage("username minimun 8 characters")
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("fullname")
    .exists()
    .withMessage("fullname is required")
    .isLength({ min: 8 })
    .withMessage("displayName minimun 8 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password minimun 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmPassword minimun 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");

      return true;
    }),
  userController.signup
);

router.get("/search", userController.search);

router.get(
  "/:userId/suggested",
  tokenMiddleware.auth,
  userController.getSuggestedUser
);

router.put(
  "/update-follow",
  tokenMiddleware.auth,
  userController.updateFollowUser
);

module.exports = router;

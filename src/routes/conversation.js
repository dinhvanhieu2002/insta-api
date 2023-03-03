const router = require("express").Router();
const conversationController = require("../controllers/ConversationController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const { body } = require("express-validator");

router.post(
  "/",
  tokenMiddleware.auth,
  body("creator")
    .exists()
    .withMessage("creator is required")
    .isLength({ min: 1 })
    .withMessage("creator cannot be empty"),
  body("members")
    .exists()
    .withMessage("members is required")
    .isLength({ min: 1 })
    .withMessage("members cannot be empty"),
  conversationController.addConversation
);

router.get(
  "/",
  tokenMiddleware.auth,
  conversationController.getConversationsOfUser
);

module.exports = router;

const router = require("express").Router();
const messageController = require("../controllers/MessageController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const { body } = require("express-validator");

router.post(
  "/",
  tokenMiddleware.auth,
  body("userId")
    .exists()
    .withMessage("userId is required")
    .isLength({ min: 1 })
    .withMessage("postId cannot be empty"),
  body("conversationId")
    .exists()
    .withMessage("conversationId is required")
    .isLength({ min: 1 })
    .withMessage("conversationId cannot be empty"),
  body("text")
    .exists()
    .withMessage("text is required")
    .isLength({ min: 1 })
    .withMessage("text cannot be empty"),
  messageController.addMessage
);

router.get(
  "/:conversationId",
  tokenMiddleware.auth,
  messageController.getMessagesOfConversation
);

module.exports = router;

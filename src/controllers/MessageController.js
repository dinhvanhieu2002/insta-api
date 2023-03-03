const messageRouter = require("express").Router();
const Message = require("../models/Message");

const addMessage = async (req, res) => {
  try {
    const { conversationId, userId, text } = req.body;

    const newMessage = new Message({
      conversationId,
      userId,
      text,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessagesOfConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

//remove message
//reply
//forward

module.exports = { addMessage, getMessagesOfConversation };

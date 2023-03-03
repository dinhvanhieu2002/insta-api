const Conversation = require("../models/Conversation");

const addConversation = async (req, res) => {
  try {
    const { creator, members } = req.body;
    const newConversation = new Conversation({
      creator,
      members,
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversationsOfUser = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user._id] },
    });
    if (!conversations)
      return res.status(204).json({ message: "no conversation is gotten" });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addConversation, getConversationsOfUser };

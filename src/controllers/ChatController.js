const Message = require("../models/Message");

module.exports = (io) => {
  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (client) => {
    console.log("new connection");

    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnected");
      removeUser(client.id);
      io.emit("getUsers", users);
    });

    client.on("addUser", (userId) => {
      addUser(userId, client.id);
      io.emit("getUsers", users);
    });

    client.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    client.on("message", (data) => {
      let messageAttributes = {
        content: data.content,
        userName: data.userName,
        user: data.userId,
      };
      let m = new Message(messageAttributes);
      m.save()
        .then(() => {
          io.emit("message", messageAttributes);
        })
        .catch((error) => {
          console.log(`error: ${error.message}`);
        });
    });

    Message.find({})
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .then((messages) => {
        client.emit("load all messages", messages.reverse());
      });
  });
};

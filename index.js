const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const config = require("./src/utils/config");
const logger = require("./src/utils/logger");
const routes = require("./src/routes/index");
const middleware = require("./src/utils/middleware");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
  },
});
require("./src/controllers/ChatController")(io);

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/v1", routes);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

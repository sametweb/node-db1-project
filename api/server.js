const express = require("express");
const server = express();
const accountsRouter = require("../data/helpers/accountsRouter");

server.use(express.json());
server.use("/api/accounts", accountsRouter);

module.exports = server;

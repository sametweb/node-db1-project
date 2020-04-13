const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/accounts", (req, res) => {
  db("accounts")
    .then((accounts) => res.status(200).json(accounts))
    .catch((err) => res.status(500).json({ error: err }));
});

server.get("/accounts/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .first()
    .then((account) => res.status(200).json(account))
    .catch((err) => res.status(500).json({ error: err }));
});

server.post("/accounts", (req, res) => {
  const newAccount = req.body;
  db("accounts")
    .insert(newAccount)
    .then((id) => {
      db("accounts")
        .where({ id: id[0] })
        .first()
        .then((account) => res.status(200).json(account));
    })
    .catch((err) => res.status(500).json({ error: err }));
});

server.patch("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db("accounts")
    .update(changes)
    .where({ id })
    .then((updated) => {
      updated
        ? db("accounts")
            .where({ id })
            .first()
            .then((account) => res.status(200).json(account))
        : res.status(500).json({ error: "Error updating the account" });
    })
    .catch((error) => res.status(500).json({ error }));
});

server.delete("/accounts/:id", (req, res) => {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .del()
    .then((deleted) => {
      deleted
        ? res.status(204).end()
        : res.status(404).json({
            error: "Requested account with the provided id cannot be found.",
          });
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = server;

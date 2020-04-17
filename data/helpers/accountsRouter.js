const express = require("express");

const db = require("../dbConfig");

const server = express.Router();

server.use(express.json());

server.get("/", (req, res) => {
  const { limit = 10, sortby = "id", sortdir = "asc" } = req.query;

  db("accounts")
    .orderBy(sortby, sortdir)
    .limit(limit)
    .then((accounts) => res.status(200).json(accounts))
    .catch((err) => res.status(500).json({ error: err }));
});

server.get("/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .first()
    .then((account) => res.status(200).json(account))
    .catch((err) => res.status(500).json({ error: err }));
});

server.post("/", (req, res) => {
  const newAccount = req.body;
  db("accounts")
    .insert(newAccount, "id")
    .then((id) => {
      db("accounts")
        .where({ id: id[0] })
        .then((account) => res.status(200).json(account))
        .catch((err) => res.status(404).json({ error: "error adding", err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
});

server.patch("/:id", (req, res) => {
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

server.delete("/:id", (req, res) => {
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

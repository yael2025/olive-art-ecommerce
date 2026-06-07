const express = require("express");
const router = express.Router();

const { customerChat } = require("../controllers/chatController");

router.post("/", customerChat);

module.exports = router;
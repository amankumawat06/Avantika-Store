const express = require("express")
const router = express.Router()
const { createUser, getUser } = require("../controllers/UserController")

router.post("/create-account", createUser)
router.post("/login", getUser)

module.exports = router
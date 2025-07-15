const express = require("express")
const { contactUsController } = require("../controllers/ContactUs")
const router = express.Router()
// const { contactUsController } = require("../controllers/ContactUs")

router.post("/contact", contactUsController)

module.exports = router

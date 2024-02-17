const express = require("express");
const authController = require("../controlers/authcontroller");

const router = express.Router();

router.get("/register", authController.get_register);
router.post("/register", authController.post_register)



module.exports = router;
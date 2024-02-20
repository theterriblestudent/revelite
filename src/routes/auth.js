const { Router } = require("express");
const { authController } = require("../controlers");

const router = Router();

router.get("/register", (req, res) => {
    res.render("signup", {
        title: "Revelite | Signup"
    });
})

router.post("/register", authController.register_post);

module.exports = router;
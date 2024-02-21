const { Router } = require("express");
const { authController } = require("../controlers");

const router = Router();

router.get("/register", (req, res) => {
    res.render("signup", {
        title: "Signup",
        layout: 'auth',
    });
})

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        layout: 'auth',
    })
});

router.post("/register", authController.register_post);
router.post("/login", authController.login_post);

module.exports = router;
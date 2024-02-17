const express = require("express");
const router = express.Router();

router.use((req, res) => {
    //Middleware;

    next();
});

router.get("/all", (req, res) => {

});

module.exports = router;

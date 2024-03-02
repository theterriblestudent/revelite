const express = require("express");
const router = express.Router();
const { shopController } = require("../controlers");

router.use((req, res, next) => {
    //Middleware;

    next();
});

router.get("/all", shopController.get_all_products);
router.get("/", shopController.get_by_category);
router.get("/search", shopController.search);
module.exports = router;

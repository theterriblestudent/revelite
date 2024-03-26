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
router.post("/cart", shopController.post_add_item_to_cart);
router.delete("/cart", shopController.delete_item_from_cart);

module.exports = router;

const { Product } = require("../models");

module.exports.get_all_products = async function(req, res) {
    try {
        const products = await Product.findAll();
        res.locals.products = products
        
        res.render('shop', {
            title: 'Products',
        })

    }catch(error) {
        console.log(error);
    }
}

module.exports.get_by_category = async function(req, res) {
    const categories = req.query.categories
    const categoryNames = ["Wheels", "Suspension", "Engine Parts", "Wiring and Electronics", "Lights", "Accessories"]

    try {
        const products = await Product.findByCategory(categories);
        let title = "";

        res.locals.products = products;

        categories.split(",").forEach(category_id => {
            if(!title) {
                title = categoryNames[parseInt(category_id) - 1];
            }else {
                title.concat(`, ${categoryNames[parseInt(category_id) - 1]}`);
            }
        }) 

        res.render('shop', {
            title: title,
        })

    }catch(error) {
        console.log(error);
    }
    

}

module.exports.search = async function(req, res) {
    const query = req.query.query;
    try {
        const products = await Product.search(query);
        res.locals.products = products;

        res.render('shop', {
            title: `Search Results for "${query}"`,
        })
    } catch(error) {
        console.log(error);
    }
}

module.exports.get_cart = async function(req, res) {
    if(res.locals.user) {
        const cart = await Product.getCartItems(res.locals.user.cart_id);
        res.status(200).json({cart, message: "Cart recieved!"});
    }
    else {
        res.status(401).json({message: "User not logged in!"});
    }
}

module.exports.post_add_item_to_cart = async function(req, res) {
    if(res.locals.user) {
        const { item_id, qty } = req.body;
        const cart_item = await Product.addItemToCart(item_id, qty, res.locals.user.cart_id);

        res.status(200).json({...cart_item, message: "Item added to cart!"});
    }else {
        res.status(401).json({message: "User is not logged in!"});
    }
}

module.exports.post_local_cart = async function(req, res) {
    const { cartItems } = req.body;

    try {
        const remoteCart = await Product.getCart(res.locals.user.cart_id);
        let values = "VALUES ";

        cartItems.forEach((cart_item, index) =>  {
            values = values.concat(`${index === 0 ? "": ", "}(${res.locals.user.cart_id}, ${cart_item.id}, ${cart_item.qty})`);
        });

        const insertedItems = await Product.addItemsToCart(values, res.locals.user.cart_id);

        const cart = remoteCart.concat(insertedItems);

        res.status(200).json({
            remoteCart: cart, 
            message: "Local cart uploaded successfully!"
        })
    }catch(error) {
        console.log(error);
        res.status(500).json({message: "Local cart could not be uploaded"});
    }
}

module.exports.delete_item_from_cart = async function(req, res) {
    try {
        Product.deleteItemFromCart(cart_item_id).then(async () => {
            res.locals.cart = await Product.getCart(res.locals.user.cart_id)
        });
        res.status(200).json({message: "Item removed from cart!"});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Could not remove item from cart!"});
    }
}
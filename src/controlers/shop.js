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
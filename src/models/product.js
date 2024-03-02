const database = require('../database');

module.exports.findAll = async function() {
    const products = await database.query(
        `SELECT product.name, description, qty_in_stock, price, image, category.name AS category FROM product
         JOIN category ON product.category_id = category.id;`
    );
    return products.rows;
}

module.exports.findByCategory = async function(categories) {
    const products = await database.query(
        `SELECT product.name, description, qty_in_stock, price, image, category.name AS category FROM product
         JOIN category ON product.category_id = category.id
         WHERE product.category_id IN(${categories});`
    );
    return products.rows;
}

module.exports.search = async function(query) {
    const products = await database.query(
    `SELECT product.name, description, qty_in_stock, price, image, category.name AS category FROM product
     JOIN category ON product.category_id = category.id
     WHERE product.name iLIKE '%${query}%';`
    );

    return products.rows;
}
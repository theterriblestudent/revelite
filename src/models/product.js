const database = require('../database');

module.exports.findAll = async function() {
    const products = await database.query(
        `SELECT product.id, product.name, description, qty_in_stock, price, image, category.name AS category FROM product
         JOIN category ON product.category_id = category.id;`
    );
    return products.rows;
}

module.exports.findByCategory = async function(categories) {
    const products = await database.query(
        `SELECT product.id, product.name, description, qty_in_stock, price, image, category.name AS category FROM product
         JOIN category ON product.category_id = category.id
         WHERE product.category_id IN(${categories});`
    );
    return products.rows;
}

module.exports.search = async function(query) {
    const products = await database.query(
    `SELECT product.id, product.name, description, qty_in_stock, price, image, category.name AS category FROM product
     JOIN category ON product.category_id = category.id
     WHERE product.name iLIKE '%${query}%';`
    );

    return products.rows;
}

module.exports.addItemToCart = async function(item_id, cart_id) {
    const cart_item = await database.query(`
        INSERT INTO cart_item(cart_id, item_id, qty) VALUES(${cart_id}, ${item_id}, 1)
        ON CONFLICT(item_id, cart_id) DO UPDATE SET
        qty = cart_item.qty + EXCLUDED.qty RETURNING *;
    `);

    return cart_item;
}

module.exports.deleteItemFromCart = async function(cart_item_id) {
    database.query(`DELETE FROM cart_item WHERE id = ${cart_item_id};`);
}

module.exports.deletItemQuantity = async function(cart_item_id) {
    const updted_item = await database.query(`
        UPDATE TABLE cart_item SET qty = qty - 1 WHERE id=${cart_item_id} RETURNING *;
    `);

    return updted_item;
}
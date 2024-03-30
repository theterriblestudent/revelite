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

module.exports.getCart = async function(user_cart_id) {
    const cart = await database.query(`
        SELECT * FROM cart_item WHERE cart_id=${user_cart_id};
    `);

    return cart.rows;
}

module.exports.getCartItems = async function(user_cart_id) {
    const cart = await database.query(`
        SELECT product.id, qty, name, price, image FROM cart_item
        JOIN product ON item_id=product.id
        WHERE cart_id=${user_cart_id};
    `);

    return cart.rows;
}

module.exports.addItemToCart = async function(item_id, qty, cart_id) {
    
    const cart_item = await database.query(`
        WITH inserted_item AS (
            INSERT INTO cart_item(cart_id, item_id, qty) VALUES(${cart_id}, ${item_id}, ${qty})
            ON CONFLICT(item_id, cart_id) DO UPDATE SET
            qty = cart_item.qty + EXCLUDED.qty RETURNING item_id  
        ) SELECT product.id, name, price, image FROM product 
          WHERE product.id IN (SELECT * FROM inserted_item);
    `);

    return cart_item.rows[0];
}

module.exports.addItemsToCart = async function(values) {
    const insertedItems = await database.query(`
        WITH data(cart, item, quantity) AS (
            ${values}
        ) INSERT INTO cart_item(cart_id, item_id, qty) 
          SELECT cart, item, quantity FROM data
          ON CONFLICT(cart_id, item_id) DO UPDATE SET
          qty = cart_item.qty + EXCLUDED.qty RETURNING *;
    `);

    return insertedItems.rows;
}

module.exports.deleteItemFromCart = async function(item_id, cart_id) {
    database.query(`DELETE FROM cart_item WHERE item_id = ${item_id} AND cart_id = ${cart_id};`);
}

module.exports.deleteItemQuantity = async function(item_id, cart_id) {
    const updted_item = await database.query(`
        UPDATE cart_item SET qty = cart_item.qty - 1 WHERE item_id=${item_id} AND cart_id = ${cart_id} RETURNING *;
    `);

    return updted_item;
}
const database = require("../database");

async function create(firstName, lastName, email, password, phone) {
    const user = await database.query(`
    INSERT INTO site_user(first_name, last_name, email, phone, password) 
    VALUES('${firstName}', '${lastName}', '${email}', '${phone}', '${password}') 
    RETURNING *;`);

    const cart_id = await database.query(`
        INSERT INTO user_cart(user_id) VALUES(${user.rows[0].id}) RETURNING id;
    `);

    return {
        ...user.rows[0],
        cart_id: cart_id.rows[0].id
    };
}

async function findByEmail(email) {
    const user = await database.query(`SELECT * FROM site_user WHERE email='${email}';`)

    if (user.rows.length === 0) throw new Error("Account with the provided email does not exist!");

    const user_cart = await database.query(`
        SELECT * FROM user_cart WHERE user_id=${user.rows[0].id};
    `);

    return {
        ...user.rows[0],
        cart_id: user_cart.rows[0].id
    };
}

module.exports = {
    create,
    findByEmail
}
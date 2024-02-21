const database = require("../database");

async function create(firstName, lastName, email, password, phone) {
    const user = await database.query(`
    INSERT INTO site_user(first_name, last_name, email, phone, password) 
    VALUES('${firstName}', '${lastName}', '${email}', '${phone}', '${password}') 
    RETURNING *;`);

    return user.rows[0];
}

async function findByEmail(email) {
    const user = await database.query(`SELECT * FROM site_user WHERE email='${email}';`)

    if (user.rows.length === 0) throw new Error("Account with the provided email does not exist!");

    return user.rows[0];
}

module.exports = {
    create,
    findByEmail
}
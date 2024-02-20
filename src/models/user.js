const database = require("../database");

async function create(firstName, lastName, email, password, phone) {
    const user = await database.query(`
    INSERT INTO site_user(first_name, last_name, email, phone, password) 
    VALUES('${firstName}', '${lastName}', '${email}', '${phone}', '${password}') 
    RETURNING *;`);

    return user.rows[0];
}

module.exports = {
    create
}
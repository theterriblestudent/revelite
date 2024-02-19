const database = require("../database");

module.exports.create = async function(name, surname, email, password, phone) {

    const user_id = await database.query(`
    INSERT INTO site_user(first_name, last_name, email, password, phone)
    VALUES('${name}', '${surname}', '${email}', '${password}', '${phone}') RETURNING id;`);

    return user_id.rows[0].id;
}

module.exports.findById = async function(id) {
    const user = await database.query(`SELECT * FROM site_user WHERE id=${id};`);

    return user.rows[0];
}
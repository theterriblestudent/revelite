const { Pool } = require("pg");

const pool = new Pool ({
    user: "bewlxnru",
    password: "G6SAj0ZUnAgnX3f4prWyVeW7cLdecerq",
    host: "topsy.db.elephantsql.com",
    port: 5432,
    database: "bewlxnru"
});

module.exports = {
    query: function(text, params) {
        return pool.query(text, params);
    }
}
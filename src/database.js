const { Pool } = require("pg");

const pool = new Pool ({
    user: "sanele_madondo",
    password: "redR!ot3500",
    host: "localhost",
    port: 5432,
    database: "revelite"
});

module.exports = {
    query: function(text, params) {
        return pool.query(text, params);
    }
}
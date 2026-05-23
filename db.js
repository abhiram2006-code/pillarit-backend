const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pillarit",
  password: "@#Abhiram12345-----6",
  port: 5432,
});

module.exports = pool;
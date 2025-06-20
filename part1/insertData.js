var mysql = require('mysql2/promise');

async function initDb() {
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
  });
}
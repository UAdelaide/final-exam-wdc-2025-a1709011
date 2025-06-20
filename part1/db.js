var mysql = require('mysql2/promise');

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
  });
}

function query(sql, params) {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool.query(sql, params);
}

module.exports = {
  initDb,
  query
};



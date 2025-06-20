var mysql = require('mysql2/promise');

async function initDb() {
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
  });

  try {

  } catch (error) {
    console.error('Error inserting test data', error);
  }
}
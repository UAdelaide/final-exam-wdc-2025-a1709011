var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { initDb, query } = require('./db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dogRouter = require('./routes/dog');

var app = express();

(async () => {
  try {
    await initDb();
    console.log("Database connected.");
    await insertTestData();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();

async function insertTestData() {

}

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    

  } catch (err) {
    console.error('Error inserting test data:', err);
  }
})();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', dogRouter);

module.exports = app;

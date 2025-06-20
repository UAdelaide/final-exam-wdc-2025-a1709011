var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dogRouter = require('./routes/dog');

var app = express();


let db;

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

    // Insert test data Users
    await db.query(`INSERT IGNORE INTO Users (username, email, password_hash, role)
                VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'),
                        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
                        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
                        ('user04', 'user04@example.com', 'user04hash', 'walker'),
                        ('user05', 'user05@example.com', 'user05hash', 'owner')
    `);

    // Dogs
    await db.query(`INSERT IGNORE INTO Dogs (owner_id, name, size)
                    SELECT user_id, 'Max', 'medium'
                    FROM Users
                    WHERE username = 'alice123'

    `);

    await db.query(`INSERT IGNORE INTO Dogs (owner_id, name, size)
                    SELECT user_id, 'Bella', 'small'
                    FROM Users
                    WHERE username = 'carol123'

    `);

    await db.query(`INSERT IGNORE INTO Dogs (owner_id, name, size)
                    SELECT user_id, 'Jack', 'large'
                    FROM Users
                    WHERE username = 'carol123'

    `);

    await db.query(`INSERT IGNORE INTO Dogs (owner_id, name, size)
                    SELECT user_id, 'Jackie', 'medium'
                    FROM Users
                    WHERE username = 'user05'

    `);

    await db.query(`INSERT IGNORE INTO Dogs (owner_id, name, size)
                    SELECT user_id, 'Mel', 'large'
                    FROM Users
                    WHERE username = 'user05'

    `);

    // WalkRequests
    await db.query(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                    SELECT dog_id, '2025-06-10 08:00:00', 30, 'Parklands', 'open'
                    FROM Dogs
                    WHERE name = 'Max'

    `);

    await db.query(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                    SELECT dog_id, '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'
                    FROM Dogs
                    WHERE name = 'Bella'

    `);

    await db.query(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                    SELECT dog_id, '2025-06-20 09:45:00', 15, 'Woodville', 'accepted'
                    FROM Dogs
                    WHERE name = 'Jack'

    `);

    await db.query(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                    SELECT dog_id, '2025-06-05 09:45:00', 35, 'Adelaide', 'cancelled'
                    FROM Dogs
                    WHERE name = 'Mel'

    `);

    await db.query(`INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
                    SELECT dog_id, '2025-06-03 10:45:00', 55, 'Henly Beach', 'completed'
                    FROM Dogs
                    WHERE name = 'Jackie'
    `);

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

module.exports = { app, db };

var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dogs', async function(req, res, next) {
    try {
        const [rows] = await db.query(`
        SELECT d.name AS dog_name, d.size, u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id
        `);
        res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving dogs' });
  }
});

router.get('/walkrequests/open', async function (req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT wr.request_id,
             d.name AS dog_name,
             wr.requested_time,
             wr.duration_minutes,
             wr.location,
             u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving open walk requests' });
  }
});


router.get('/walkers/summary', async function(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT u.username AS walker_username,
             COUNT(r.rating_id) AS total_ratings,
             AVG(r.rating) AS average_rating,
             SUM(CASE WHEN wr.status = 'completed' THEN 1 ELSE 0 END) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
      LEFT JOIN WalkRequests wr ON r.request_id = wr.request_id
      WHERE u.role = 'walker'
      GROUP BY u.username
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving walker summary' });
  }
});

module.exports = router;

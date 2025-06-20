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

module.exports = router;

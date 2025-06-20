var mysql = require('mysql2/promise');



// module.exports = db;
module.exports = {
  query: async (sql, params) => {
    if (!db) {
      throw new Error("Database pool not initialized");
    }
    return db.query(sql, params);
  }
};

const express = require('express');
const router = express.Router();
const db = require('../db'); // DB 연결 코드 가져오기

router.get('/routinefetch', (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      console.error("User ID is missing in request");
      return res.status(400).send({ error: 'User ID is required' });
    }
  
    console.log("Fetching routines for user_id:", user_id);
  
    // 콜백 방식으로 쿼리 실행
    db.query('SELECT * FROM routine WHERE user_id = ?', [user_id], (error, results) => {
      if (error) {
        console.error('Error fetching routines:', error.message);
        return res.status(500).send({ error: 'Failed to fetch routines' });
      }
  
      if (results.length === 0) {
        console.log("No routines found for user ID:", user_id);
        return res.status(200).send({ tasks: [] });
      }
  
      console.log("Routines fetched successfully:", results);
      res.status(200).send({ tasks: results });
    });
  });

router.post("/routinesave", (req, res) => {
    const { id, user_id, type, content, is_completed } = req.body;
    console.log("Received task:", req.body); // 디버깅용
    const query = "INSERT INTO routine (id, user_id, type, content, is_completed) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [id, user_id, type, content, is_completed], (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("Task added successfully");
      }
    });
});
  
router.put('/routinetoggle', (req, res) => {
    const { id, user_id } = req.body;
  
    if (!id || !user_id) {
      return res.status(400).json({ error: "Missing id or user_id" });
    }
  
    const query = `UPDATE routine SET is_completed = NOT is_completed WHERE id = ? AND user_id = ?`;
    db.query(query, [id, user_id], (error, results) => {
      if (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ error: "Database update failed" });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({ message: "Task toggled successfully" });
    });
  });

  
router.delete('/routinedelete', (req, res) => {
    const { id, user_id } = req.body;

    console.log("Received task delete request:", req.body); // 디버깅용

    if (typeof id === 'undefined' || typeof user_id === 'undefined') {
        return res.status(400).json({ error: "Missing required fields: id and user_id are required" });
    }

    const query = `DELETE FROM routine WHERE id = ? AND user_id = ?`;
    const params = [id, user_id];

    db.query(query, params, (error, results) => {
        if (error) {
            console.error("Database delete error:", error);
            return res.status(500).json({ error: "Database delete failed" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    });
});


module.exports = router;
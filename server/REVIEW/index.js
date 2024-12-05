const express = require('express');
const router = express.Router();
const db = require('../db'); // DB 연결 코드 가져오기

router.get("/reviewfetch", (req, res) => {
  const { user_id } = req.query;

  const query = `
      SELECT success_rate, achievement, improvement
      FROM review
      WHERE user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
      if (err) {
          console.error("Error fetching review:", err);
          return res.status(500).json({ error: "Server error" });
      }

      if (results.length > 0) {
          console.log("Fetched review data:", results[0]);
          res.json(results[0]); // 성공률, 성취한 점, 개선할 점 반환
      } else {
          res.status(404).json({ error: "Review not found" });
      }
  });
});

  
  router.post("/reviewinput", (req, res) => {
    const { user_id, strengths, improvements } = req.body;
  
    console.log("Received data for insertion:", { user_id, strengths, improvements });
  
    const query = `
      INSERT INTO review (user_id, achievement, improvement, updated_at)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        achievement = VALUES(achievement),
        improvement = VALUES(improvement),
        updated_at = NOW()
    `;
  
    db.query(query, [user_id, strengths, improvements], (err, result) => {
      if (err) {
        console.error("Error updating review:", err);
        return res.status(500).json({ error: "Server error" });
      }
  
      console.log("Query result:", result);
      res.status(200).json({ message: "Review updated successfully" });
    });
  });
  
  
  module.exports = router;
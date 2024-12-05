const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/userdata', async (req, res) => {
    try {
        // 세션 테이블에서 로그인된 사용자 ID 가져오기
        const sessionQuery = "SELECT user_id, user_name FROM session LIMIT 1"; // 예시로 하나의 사용자만 조회
        const sessionResult = await db.promise().query(sessionQuery);

        if (sessionResult[0].length === 0) {
            return res.status(404).json({ message: "No active session found" });
        }

        const userId = sessionResult[0][0].user_id;
        const userName = sessionResult[0][0].user_name;

        // usertype 테이블에서 해당 사용자의 유형 가져오기
        const userTypeQuery = "SELECT user_type FROM usertype WHERE user_id = ?";
        const userTypeResult = await db.promise().query(userTypeQuery, [userId]);

        if (userTypeResult[0].length === 0) {
            return res.status(404).json({ message: "User type not found" });
        }

        const userType = userTypeResult[0][0].user_type;

        // 사용자 이름과 유형 반환
        res.json({ userName, userType });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/myreviewfetch", (req, res) => {
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
            console.log("Fetched review data:", results);
            res.json(results); // 모든 리뷰 데이터 반환
        } else {
            res.status(404).json({ error: "No reviews found" });
        }
    });
  });
  
  router.delete('/deletereview', async (req, res) => {
    const { user_id } = req.body; // 클라이언트에서 user_id를 전달받음

    if (!user_id) {
        return res.status(400).json({ error: "Bad request: user_id is required." });
    }

    try {
        const query = "UPDATE review SET achievement = NULL, improvement = NULL WHERE user_id = ?";
        const [result] = await db.promise().execute(query, [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No review found for this user." });
        }

        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Server error." });
    }
});


module.exports = router;

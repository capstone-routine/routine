const express = require('express');
const db = require('./db');
const router = express.Router();

// 전체보기
app.get("/purpose", (req, res) => {
    const userId = req.session.user_id;
    const query = "SELECT * FROM purpose WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send("Error fetching data");
        } else {
            res.json(results[0]); // 첫 번째 결과 반환
        }
    });
});

// 불러오기
router.get("/getpurpose", (req, res) => {
    const { number } = req.params;
    const userId = req.session.user_id;
    const columnTitle = `purpose_${number}_title`;
    const columnContent = `purpose_${number}_content`;

    const query = `SELECT ${columnTitle} as title, ${columnContent} as content FROM purpose WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send("Error fetching data");
        } else {
            res.json(results[0]);
        }
    });
});

// 입력 및 변경
router.post("/postpurpose", (req, res) => {
    const { number, title, content } = req.body;
    const userId = req.session.user_id;
    const columnTitle = `purpose_${number}_title`;
    const columnContent = `purpose_${number}_content`;

    const query = `UPDATE purpose SET ${columnTitle} = ?, ${columnContent} = ?, updated_at = NOW() WHERE user_id = ?`;
    db.query(query, [title, content, userId], (err) => {
        if (err) {
            res.status(500).send("Error updating data");
        } else {
            res.send("Data updated successfully");
        }
    });
});

module.exports = router;

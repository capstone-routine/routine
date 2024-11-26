const express = require('express');
const db = require('./db');
const router = express.Router();

router.get("/achieve", (req, res) => {
    const userId = req.session.user_id; // 세션에서 사용자 ID 가져오기
    const query = "SELECT * FROM achieve WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "데이터를 가져오는 중 오류가 발생했습니다." });
        }
        res.json(results[0]); // 첫 번째 결과 반환
    });
});

// 2. 특정 번호 데이터 가져오기
router.get("/getacheive", (req, res) => {
    const { number } = req.params;
    const userId = req.session.user_id;
    const columnTitle = `achieve_${number}_title`;
    const columnContent = `achieve_${number}_content`;

    const query = `SELECT ${columnTitle} as title, ${columnContent} as content FROM achieve WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "데이터를 가져오는 중 오류가 발생했습니다." });
        }
        res.json(results[0]);
    });
});

// 3. 데이터 업데이트
router.post("/postacheive", (req, res) => {
    const { number, title, content } = req.body;
    const userId = req.session.user_id;
    const columnTitle = `achieve_${number}_title`;
    const columnContent = `achieve_${number}_content`;

    const query = `UPDATE achieve SET ${columnTitle} = ?, ${columnContent} = ?, updated_at = NOW() WHERE user_id = ?`;
    db.query(query, [title, content, userId], (err) => {
        if (err) {
            return res.status(500).json({ message: "데이터 업데이트 중 오류가 발생했습니다." });
        }
        res.json({ message: "데이터가 성공적으로 업데이트되었습니다." });
    });
});

module.exports = router;

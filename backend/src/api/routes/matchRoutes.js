const express = require('express');
const { createMatch, getMatches, updateMatchScore } = require('../controllers/matchController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getMatches);
router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createMatch);
router.patch('/:matchId/score', authMiddleware, roleMiddleware(['owner', 'admin']), updateMatchScore);

module.exports = router;

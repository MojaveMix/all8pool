const express = require('express');
const { 
  createMatch, 
  getMatches, 
  updateMatchScore, 
  joinMatch, 
  verifyMatch 
} = require('../controllers/matchController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getMatches);
router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createMatch);
router.post('/:matchId/join', authMiddleware, roleMiddleware(['player']), joinMatch);
router.patch('/:matchId/verify', authMiddleware, roleMiddleware(['owner', 'admin']), verifyMatch);
router.patch('/:matchId/score', authMiddleware, roleMiddleware(['owner', 'admin']), updateMatchScore);

module.exports = router;

const express = require('express');
const { 
  createMatch, 
  getMatches, 
  updateMatchScore, 
  joinMatch, 
  verifyMatch,
  sendChallenge,
  respondToChallenge,
  organizeChallenge
} = require('../controllers/matchController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validateUUID } = require('../middlewares/validationMiddleware');
const { challengeLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.get('/', getMatches);
router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createMatch);
router.post('/challenge', authMiddleware, roleMiddleware(['player']), challengeLimiter, sendChallenge);
router.post('/:matchId/join', authMiddleware, roleMiddleware(['player']), validateUUID('matchId'), challengeLimiter, joinMatch);
router.patch('/:matchId/respond', authMiddleware, roleMiddleware(['player']), validateUUID('matchId'), challengeLimiter, respondToChallenge);
router.patch('/:matchId/organize', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('matchId'), organizeChallenge);
router.patch('/:matchId/verify', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('matchId'), verifyMatch);
router.patch('/:matchId/score', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('matchId'), updateMatchScore);

module.exports = router;

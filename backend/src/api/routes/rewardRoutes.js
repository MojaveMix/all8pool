const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, rewardController.getRewards);
router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), rewardController.createReward);
router.post('/:rewardId/redeem', authMiddleware, rewardController.redeemReward);

module.exports = router;

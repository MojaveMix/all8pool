const express = require('express');
const { createPoolHall, getMyPoolHalls, getAllPoolHalls } = require('../controllers/poolHallController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createPoolHall);
router.get('/my', authMiddleware, roleMiddleware(['owner', 'admin']), getMyPoolHalls);
router.get('/', getAllPoolHalls);

module.exports = router;

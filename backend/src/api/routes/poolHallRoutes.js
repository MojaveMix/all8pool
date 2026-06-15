const express = require('express');
const { createPoolHall, getMyPoolHalls, getAllPoolHalls, updatePoolHall } = require('../controllers/poolHallController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createPoolHall);
router.get('/my', authMiddleware, roleMiddleware(['owner', 'admin']), getMyPoolHalls);
router.put('/:id', authMiddleware, roleMiddleware(['owner', 'admin']), updatePoolHall);
router.get('/', getAllPoolHalls);

module.exports = router;

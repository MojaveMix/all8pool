const express = require('express');
const { createPoolHall, getMyPoolHalls, getAllPoolHalls, updatePoolHall, getPoolHallById } = require('../controllers/poolHallController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validateUUID } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), createPoolHall);
router.get('/my', authMiddleware, roleMiddleware(['owner', 'admin']), getMyPoolHalls);
router.put('/:id', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('id'), updatePoolHall);
router.get('/:id', validateUUID('id'), getPoolHallById);
router.get('/', getAllPoolHalls);

module.exports = router;


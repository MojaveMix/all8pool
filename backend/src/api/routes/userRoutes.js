const express = require('express');
const { getUsers, getRankings, getProfile, getUserProfile } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.get('/rankings', getRankings);
router.get('/:id', getUserProfile);
router.get('/', authMiddleware, roleMiddleware(['owner', 'admin']), getUsers);

module.exports = router;

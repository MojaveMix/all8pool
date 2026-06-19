const express = require('express');
const { getUsers, getRankings, getProfile, getUserProfile, getGlobalStats, updateUserRole, createUser, updateUserStatus, deleteUser, updateProfile } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.get('/rankings', getRankings);
router.get('/stats', getGlobalStats);
router.get('/:id', getUserProfile);
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), updateUserStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;

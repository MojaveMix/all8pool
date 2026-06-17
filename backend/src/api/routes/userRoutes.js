const express = require('express');
const { getUsers, getRankings, getProfile, getUserProfile, updateUserRole, createUser, updateUserStatus, deleteUser } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.get('/rankings', getRankings);
router.get('/:id', getUserProfile);
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), updateUserStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;

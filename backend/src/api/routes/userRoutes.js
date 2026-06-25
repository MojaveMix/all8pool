const express = require('express');
const { getUsers, getRankings, getProfile, getUserProfile, getGlobalStats, updateUserRole, createUser, updateUserStatus, deleteUser, updateProfile } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validateUUID } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);
router.get('/rankings', getRankings);
router.get('/stats', getGlobalStats);
router.get('/:id', validateUUID('id'), getUserProfile);
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);
router.patch('/:id/role', authMiddleware, roleMiddleware(['admin']), validateUUID('id'), updateUserRole);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), validateUUID('id'), updateUserStatus);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), validateUUID('id'), deleteUser);

module.exports = router;

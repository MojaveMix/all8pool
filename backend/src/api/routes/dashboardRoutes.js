const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/stats', authMiddleware, roleMiddleware(['owner', 'admin']), getDashboardStats);

module.exports = router;

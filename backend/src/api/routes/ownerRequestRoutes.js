const express = require('express');
const { createOwnerRequest, getOwnerRequests, updateOwnerRequestStatus } = require('../controllers/ownerRequestController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route to apply
router.post('/', createOwnerRequest);

// Admin routes to manage applications
router.get('/', authMiddleware, roleMiddleware(['admin']), getOwnerRequests);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), updateOwnerRequestStatus);

module.exports = router;
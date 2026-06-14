const express = require('express');
const { getUsers } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['owner', 'admin']), getUsers);

module.exports = router;

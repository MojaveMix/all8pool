const express = require('express');
const { addTable, updateTableStatus } = require('../controllers/tableController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), addTable);
router.patch('/:tableId/status', authMiddleware, roleMiddleware(['owner', 'admin']), updateTableStatus);

module.exports = router;

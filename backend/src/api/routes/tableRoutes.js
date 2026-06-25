const express = require('express');
const { addTable, updateTableStatus } = require('../controllers/tableController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validateUUID } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), addTable);
router.patch('/:tableId/status', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('tableId'), updateTableStatus);

module.exports = router;

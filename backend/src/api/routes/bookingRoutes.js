const express = require('express');
const { 
  createBooking, 
  getMyBookings, 
  getHallBookings, 
  updateBookingPlayers,
  assignPlayer,
  updateBookingStatus 
} = require('../controllers/bookingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { validateUUID } = require('../middlewares/validationMiddleware');
const { bookingLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.get('/my', authMiddleware, getMyBookings);
router.get('/hall', authMiddleware, roleMiddleware(['owner', 'admin']), getHallBookings);
router.post('/', authMiddleware, bookingLimiter, createBooking);
router.patch('/:bookingId/players', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('bookingId'), updateBookingPlayers);
router.patch('/:bookingId/assign-player', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('bookingId'), assignPlayer);
router.patch('/:bookingId/status', authMiddleware, roleMiddleware(['owner', 'admin']), validateUUID('bookingId'), updateBookingStatus);

module.exports = router;


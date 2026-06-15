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

const router = express.Router();

router.get('/my', authMiddleware, getMyBookings);
router.get('/hall', authMiddleware, roleMiddleware(['owner', 'admin']), getHallBookings);
router.post('/', authMiddleware, createBooking);
router.patch('/:bookingId/players', authMiddleware, roleMiddleware(['owner', 'admin']), updateBookingPlayers);
router.patch('/:bookingId/assign-player', authMiddleware, roleMiddleware(['owner', 'admin']), assignPlayer);
router.patch('/:bookingId/status', authMiddleware, roleMiddleware(['owner', 'admin']), updateBookingStatus);

module.exports = router;


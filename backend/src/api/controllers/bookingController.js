const { Booking, Table, PoolHall, User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');

const createBooking = async (req, res) => {
  try {
    const { 
      tableId, 
      startTime, 
      endTime, 
      player1Id,
      player1Name, 
      player1Email,
      player2Id, 
      player2Name,
      player2Email 
    } = req.body;
    
    // Check if table exists
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check for double booking (overlapping slots)
    const existingBooking = await Booking.findOne({
      where: {
        tableId,
        status: { [Op.not]: 'cancelled' },
        [Op.and]: [
          { startTime: { [Op.lt]: endTime } },
          { endTime: { [Op.gt]: startTime } }
        ]
      }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Table is already booked for this time slot' });
    }

    // Calculate price
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    let totalPrice = hours * table.pricePerHour;
    
    // Apply Promotion
    let appliedPromotion = null;
    let discountAmount = 0;
    
    const poolHall = await PoolHall.findByPk(table.poolHallId);
    if (poolHall && poolHall.promotionType !== 'none') {
      if (poolHall.promotionType === 'percentage') {
        discountAmount = (totalPrice * poolHall.promotionValue) / 100;
        appliedPromotion = `${poolHall.promotionValue}% OFF`;
      } else if (poolHall.promotionType === 'free') {
        discountAmount = totalPrice;
        appliedPromotion = 'FREE MATCH';
      }
      totalPrice -= discountAmount;
    }

    const booking = await Booking.create({
      userId: player1Id || (req.user.role === 'player' ? req.user.id : null),
      player1Name: player1Name || (req.user.role === 'player' ? req.user.name : 'Guest'),
      player1Email: player1Email || (req.user.role === 'player' ? req.user.email : null),
      player2Id,
      player2Name,
      player2Email,
      tableId,
      startTime,
      endTime,
      totalPrice,
      appliedPromotion,
      discountAmount,
      status: 'confirmed', // Auto-confirm for MVP
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: Table, 
          as: 'table',
          include: [{ model: PoolHall, as: 'poolHall' }]
        },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: User, as: 'player2', attributes: ['id', 'name'] }
      ],
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getHallBookings = async (req, res) => {
  try {
    const { hallId } = req.query;
    const { role, id } = req.user;

    // Check ownership if not admin
    if (role === 'owner') {
      const hall = await PoolHall.findOne({ where: { id: hallId, ownerId: id } });
      if (!hall) return res.status(403).json({ message: 'You do not own this pool hall' });
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.findAll({
      include: [
        { 
          model: Table, 
          as: 'table',
          where: { poolHallId: hallId }
        },
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: User, as: 'player2', attributes: ['id', 'name'] }
      ],
      order: [['startTime', 'ASC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookingPlayers = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId, player1Name, player1Email, player2Id, player2Name, player2Email } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (userId !== undefined) booking.userId = userId;
    if (player1Name !== undefined) booking.player1Name = player1Name;
    if (player1Email !== undefined) booking.player1Email = player1Email;
    if (player2Id !== undefined) booking.player2Id = player2Id;
    if (player2Name !== undefined) booking.player2Name = player2Name;
    if (player2Email !== undefined) booking.player2Email = player2Email;

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignPlayer = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { playerIndex, userId, name, email } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (playerIndex === 1) {
      booking.userId = userId || null;
      booking.player1Name = name;
      booking.player1Email = email || null;
    } else if (playerIndex === 2) {
      booking.player2Id = userId || null;
      booking.player2Name = name;
      booking.player2Email = email || null;
    } else {
      return res.status(400).json({ message: 'Invalid player index' });
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHallBookings,
  updateBookingPlayers,
  assignPlayer,
  updateBookingStatus
};

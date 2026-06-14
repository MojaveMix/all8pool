const { Booking, Table, PoolHall, User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');

const createBooking = async (req, res) => {
  try {
    const { tableId, startTime, endTime, player2Id, player2Name, player1Name } = req.body;
    
    // Check if table exists
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check for double booking
    const existingBooking = await Booking.findOne({
      where: {
        tableId,
        status: { [Op.not]: 'cancelled' },
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] }
          },
          {
            endTime: { [Op.between]: [startTime, endTime] }
          }
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
    const totalPrice = hours * table.pricePerHour;

    const booking = await Booking.create({
      userId: req.user ? req.user.id : null, // req.user.id if client, null if guest booking by owner
      player1Name: player1Name || (req.user ? req.user.name : 'Guest'),
      player2Id,
      player2Name,
      tableId,
      startTime,
      endTime,
      totalPrice,
      status: 'confirmed', // Auto-confirm for MVP
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
        { model: User, as: 'user', attributes: ['name'] },
        { model: User, as: 'player2', attributes: ['name'] }
      ],
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHallBookings = async (req, res) => {
  try {
    const { hallId } = req.query;
    const bookings = await Booking.findAll({
      include: [
        { 
          model: Table, 
          as: 'table',
          where: { poolHallId: hallId }
        },
        { model: User, as: 'user', attributes: ['name'] },
        { model: User, as: 'player2', attributes: ['name'] }
      ],
      order: [['startTime', 'ASC']]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingPlayers = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { player1Name, player2Id, player2Name } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (player1Name) booking.player1Name = player1Name;
    if (player2Id !== undefined) booking.player2Id = player2Id;
    if (player2Name !== undefined) booking.player2Name = player2Name;

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHallBookings,
  updateBookingPlayers
};

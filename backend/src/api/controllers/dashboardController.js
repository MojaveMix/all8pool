const { Booking, Table, Match, PoolHall, User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const { hallId } = req.query;
    if (!hallId) return res.status(400).json({ message: 'Hall ID is required' });

    // Verify ownership
    const hall = await PoolHall.findOne({ where: { id: hallId, ownerId: req.user.id } });
    if (!hall) return res.status(403).json({ message: 'Not authorized' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Active Tables
    const activeTablesCount = await Table.count({
      where: { poolHallId: hallId, status: 'occupied' }
    });

    // 2. Today's Bookings
    const todayBookingsCount = await Booking.count({
      where: {
        startTime: { [Op.between]: [todayStart, todayEnd] },
        status: 'confirmed'
      },
      include: [{ model: Table, as: 'table', where: { poolHallId: hallId } }]
    });

    // 3. Today's Revenue
    const todayRevenue = await Booking.sum('totalPrice', {
      where: {
        startTime: { [Op.between]: [todayStart, todayEnd] },
        status: 'completed'
      },
      include: [{ model: Table, as: 'table', where: { poolHallId: hallId } }]
    }) || 0;

    // 4. Active Matches
    const activeMatchesCount = await Match.count({
      where: { poolHallId: hallId, status: 'live' }
    });

    // 5. Next Booking Countdown (simplified: just the next booking time)
    const nextBooking = await Booking.findOne({
      where: {
        startTime: { [Op.gt]: new Date() },
        status: 'confirmed'
      },
      include: [{ model: Table, as: 'table', where: { poolHallId: hallId } }],
      order: [['startTime', 'ASC']]
    });

    // 6. Live Tables Data
    const liveTables = await Table.findAll({
      where: { poolHallId: hallId },
      include: [{ 
        model: Match, 
        as: 'matches', 
        where: { status: 'live' }, 
        required: false,
        include: [
          { model: User, as: 'player1', attributes: ['name'] },
          { model: User, as: 'player2', attributes: ['name'] }
        ]
      }]
    });

    // 7. Analytics - Peak Hours (simplified mockup data)
    const peakHours = [
      { hour: '09:00', bookings: 2 },
      { hour: '12:00', bookings: 5 },
      { hour: '15:00', bookings: 8 },
      { hour: '18:00', bookings: 12 },
      { hour: '21:00', bookings: 10 },
    ];

    res.json({
      summary: {
        activeTables: activeTablesCount,
        todayBookings: todayBookingsCount,
        todayRevenue,
        activeMatches: activeMatchesCount,
        nextBooking: nextBooking ? nextBooking.startTime : null
      },
      liveTables,
      peakHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };

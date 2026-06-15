const { Match, Table, User, Booking, PoolHall } = require('../../infrastructure/database/models');

const createMatch = async (req, res) => {
  try {
    const { 
      tableId, 
      poolHallId, 
      player1Id, 
      player1Name, 
      player2Id, 
      player2Name, 
      bookingId,
      status // Optional status
    } = req.body;

    // Check ownership if not admin
    if (req.user.role === 'owner') {
      const hall = await PoolHall.findOne({ where: { id: poolHallId, ownerId: req.user.id } });
      if (!hall) return res.status(403).json({ message: 'You do not own this pool hall' });
    }

    let appliedPromotion = null;
    let discountAmount = 0;
    let totalPrice = 0;

    if (bookingId) {
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        appliedPromotion = booking.appliedPromotion;
        discountAmount = booking.discountAmount;
        totalPrice = booking.totalPrice;
      }
    } else {
      const hall = await PoolHall.findByPk(poolHallId);
      const table = await Table.findByPk(tableId);
      if (hall && table && hall.promotionType !== 'none') {
        if (hall.promotionType === 'percentage') {
          appliedPromotion = `${hall.promotionValue}% OFF`;
        } else if (hall.promotionType === 'free') {
          appliedPromotion = 'FREE MATCH';
        }
      }
    }

    const match = await Match.create({
      tableId,
      poolHallId,
      player1Id,
      player1Name,
      player2Id,
      player2Name,
      bookingId,
      appliedPromotion,
      discountAmount,
      totalPrice,
      status: status || (player2Id || player2Name ? 'matched' : 'open'),
      startTime: new Date()
    });

    // Update table status
    await Table.update({ status: 'occupied' }, { where: { id: tableId } });

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const joinMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.player2Id) return res.status(400).json({ message: 'Match is already full' });
    if (match.status !== 'open') return res.status(400).json({ message: 'Match is not open for joining' });

    match.player2Id = req.user.id;
    match.player2Name = req.user.name;
    match.status = 'matched'; // Moves to matched, waiting for owner verification
    await match.save();

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    // Only owner of the hall can verify
    const hall = await PoolHall.findByPk(match.poolHallId);
    if (hall.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the hall owner can verify matches' });
    }

    match.status = 'live';
    match.startTime = new Date(); // Reset start time to actual play time
    await match.save();

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMatches = async (req, res) => {
  try {
    const { hallId, status } = req.query;
    const where = {};
    if (hallId) where.poolHallId = hallId;
    if (status) where.status = status;

    const matches = await Match.findAll({
      where,
      include: [
        { model: Table, as: 'table', attributes: ['number'] },
        { model: User, as: 'player1', attributes: ['id', 'name', 'avatar', 'rating'] },
        { model: User, as: 'player2', attributes: ['id', 'name', 'avatar', 'rating'] },
        { model: PoolHall, as: 'poolHall', attributes: ['name', 'city'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { 
      score1, 
      score2, 
      status, 
      isPaid, 
      player1Id, 
      player1Name, 
      player2Id, 
      player2Name 
    } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (score1 !== undefined) match.score1 = score1;
    if (score2 !== undefined) match.score2 = score2;
    if (isPaid !== undefined) match.isPaid = isPaid;
    
    if (player1Id !== undefined) match.player1Id = player1Id;
    if (player1Name !== undefined) match.player1Name = player1Name;
    if (player2Id !== undefined) match.player2Id = player2Id;
    if (player2Name !== undefined) match.player2Name = player2Name;

    if (status === 'finished' && match.status !== 'finished') {
      match.status = status;
      match.endTime = new Date();

      // Determine winner
      let winnerId = null;
      let loserId = null;
      if (match.score1 > match.score2) {
        winnerId = match.player1Id;
        loserId = match.player2Id;
      } else if (match.score2 > match.score1) {
        winnerId = match.player2Id;
        loserId = match.player1Id;
      }
      match.winnerId = winnerId;

      // Update User Stats and Ratings
      if (winnerId) {
        const winner = await User.findByPk(winnerId);
        if (winner) {
          winner.wins += 1;
          winner.rating = Math.min(5, parseFloat(winner.rating) + 0.2);
          await winner.save();
        }
      }

      if (loserId) {
        const loser = await User.findByPk(loserId);
        if (loser) {
          loser.losses += 1;
          loser.rating = Math.max(1, parseFloat(loser.rating) - 0.1);
          await loser.save();
        }
      }

      // Handle unpaid penalty
      if (isPaid === false) {
        if (match.player1Id) {
          const p1 = await User.findByPk(match.player1Id);
          if (p1) {
            p1.unpaidCount += 1;
            p1.rating = Math.max(1, parseFloat(p1.rating) - 1.0);
            await p1.save();
          }
        }
        if (match.player2Id) {
          const p2 = await User.findByPk(match.player2Id);
          if (p2) {
            p2.unpaidCount += 1;
            p2.rating = Math.max(1, parseFloat(p2.rating) - 1.0);
            await p2.save();
          }
        }
      }

      // Set table to available when match finishes
      await Table.update({ status: 'available' }, { where: { id: match.tableId } });
    } else if (status) {
      match.status = status;
    }

    await match.save();
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createMatch,
  joinMatch,
  getMatches,
  updateMatchScore,
  verifyMatch,
};

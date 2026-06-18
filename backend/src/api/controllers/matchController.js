const { Match, Table, User, Booking, PoolHall } = require('../../infrastructure/database/models');

const updateUserStats = async (match) => {
  if (match.status !== 'finished') return;

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

  // Update User Stats, Ratings and Virtual Money
  const baseReward = 50;
  if (winnerId) {
    const winner = await User.findByPk(winnerId);
    if (winner) {
      winner.wins += 1;
      winner.points += 50;
      winner.rating = Math.min(5, parseFloat(winner.rating) + 0.2);
      
      // Award money: base reward + stake from opponent
      winner.virtualMoney += baseReward + (match.stake || 0);
      await winner.save();
    }
  }

  if (loserId) {
    const loser = await User.findByPk(loserId);
    if (loser) {
      loser.losses += 1;
      loser.points = Math.max(0, loser.points - 10);
      loser.rating = Math.max(1, parseFloat(loser.rating) - 0.1);
      
      // Deduct stake from loser
      if (match.stake > 0) {
        loser.virtualMoney = Math.max(0, loser.virtualMoney - match.stake);
      }
      await loser.save();
    }
  }

  // Handle unpaid penalty
  if (match.isPaid === false) {
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
  await match.save();
};

const createMatch = async (req, res) => {
  try {
    const { 
      tableId, 
      poolHallId, 
      player1Id, 
      player1Name, 
      player1Email,
      player2Id, 
      player2Name, 
      player2Email,
      bookingId,
      status, 
      score1,
      score2,
      stake,
      isPaid
    } = req.body;

    // Check if player1 has enough money for stake
    if (stake > 0 && player1Id) {
      const p1 = await User.findByPk(player1Id);
      if (p1 && p1.virtualMoney < stake) {
        return res.status(400).json({ message: 'Insufficient virtual money for this stake' });
      }
    }

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
      player1Email,
      player2Id,
      player2Name,
      player2Email,
      bookingId,
      appliedPromotion,
      discountAmount,
      totalPrice,
      score1: score1 || 0,
      score2: score2 || 0,
      stake: stake || 0,
      isPaid: isPaid !== undefined ? isPaid : true,
      status: status || ((player1Id || player1Name) && (player2Id || player2Name) ? 'matched' : 'open'),
      startTime: new Date(),
      endTime: status === 'finished' ? new Date() : null
    });

    if (status === 'finished') {
      await updateUserStats(match);
    } else {
      // Update table status to occupied if not finished
      await Table.update({ status: 'occupied' }, { where: { id: tableId } });
    }

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const joinMatch = async (req, res) => {
  // ... existing joinMatch implementation ...
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.player2Id) return res.status(400).json({ message: 'Match is already full' });
    if (match.status !== 'open') return res.status(400).json({ message: 'Match is not open for joining' });

    // Check if player 2 has enough money for the stake
    if (match.stake > 0) {
      const p2 = await User.findByPk(req.user.id);
      if (p2 && p2.virtualMoney < match.stake) {
        return res.status(400).json({ message: 'Insufficient virtual money for this match stake' });
      }
    }

    match.player2Id = req.user.id;
    match.player2Name = req.user.name;
    match.player2Email = req.user.email;
    match.status = 'matched'; 
    await match.save();

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyMatch = async (req, res) => {
  // ... existing verifyMatch implementation ...
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);

    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    const hall = await PoolHall.findByPk(match.poolHallId);
    if (hall.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the hall owner can verify matches' });
    }

    match.status = 'live';
    match.startTime = new Date(); 
    await match.save();

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMatches = async (req, res) => {
  // ... existing getMatches implementation ...
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
      player1Email,
      player2Id, 
      player2Name,
      player2Email 
    } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (score1 !== undefined) match.score1 = score1;
    if (score2 !== undefined) match.score2 = score2;
    if (isPaid !== undefined) match.isPaid = isPaid;
    
    if (player1Id !== undefined) match.player1Id = player1Id;
    if (player1Name !== undefined) match.player1Name = player1Name;
    if (player1Email !== undefined) match.player1Email = player1Email;
    if (player2Id !== undefined) match.player2Id = player2Id;
    if (player2Name !== undefined) match.player2Name = player2Name;
    if (player2Email !== undefined) match.player2Email = player2Email;

    // Auto-update status to 'matched' if both players are present and status is 'open'
    if (match.status === 'open' && (match.player1Id || match.player1Name) && (match.player2Id || match.player2Name)) {
      match.status = 'matched';
    }

    if (status === 'finished' && match.status !== 'finished') {
      match.status = status;
      match.endTime = new Date();
      await updateUserStats(match);
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

const sendChallenge = async (req, res) => {
  try {
    const { player2Id, poolHallId, scheduledStartTime, stake } = req.body;
    const player1Id = req.user.id;

    if (player2Id && player1Id === player2Id) {
      return res.status(400).json({ message: 'You cannot challenge yourself' });
    }

    // Check if player1 has enough money
    if (stake > 0) {
      const p1 = await User.findByPk(player1Id);
      if (p1 && p1.virtualMoney < stake) {
        return res.status(400).json({ message: 'Insufficient virtual money for this stake' });
      }
    }

    let player2 = null;
    if (player2Id) {
      player2 = await User.findByPk(player2Id);
      if (!player2) return res.status(404).json({ message: 'Challenged player not found' });
    }

    const match = await Match.create({
      player1Id,
      player1Name: req.user.name,
      player1Email: req.user.email,
      player2Id: player2Id || null,
      player2Name: player2 ? player2.name : null,
      player2Email: player2 ? player2.email : null,
      poolHallId,
      tableId: null,
      scheduledStartTime,
      stake: stake || 0,
      status: 'challenge',
      challengeStatus: 'pending',
      isPaid: false
    });

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const respondToChallenge = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    const match = await Match.findByPk(matchId);
    if (!match) return res.status(404).json({ message: 'Challenge not found' });

    if (match.player2Id !== req.user.id) {
      return res.status(403).json({ message: 'You are not the challenged player' });
    }

    if (match.challengeStatus !== 'pending') {
      return res.status(400).json({ message: 'Challenge is no longer pending' });
    }

    if (action === 'accept') {
      // Check if player2 has enough money
      if (match.stake > 0) {
        const p2 = await User.findByPk(req.user.id);
        if (p2 && p2.virtualMoney < match.stake) {
          return res.status(400).json({ message: 'Insufficient virtual money for this stake' });
        }
      }
      match.challengeStatus = 'accepted';
    } else {
      match.challengeStatus = 'rejected';
      match.status = 'cancelled';
    }

    await match.save();
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const organizeChallenge = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { tableId, scheduledStartTime } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const hall = await PoolHall.findByPk(match.poolHallId);
    if (hall.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the hall owner can organize challenges' });
    }

    if (match.challengeStatus !== 'accepted') {
      return res.status(400).json({ message: 'Challenge must be accepted by both players first' });
    }

    if (tableId) match.tableId = tableId;
    if (scheduledStartTime) match.scheduledStartTime = scheduledStartTime;
    
    match.status = 'matched'; // Moves to matched status, ready to be verified/live when players arrive
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
  sendChallenge,
  respondToChallenge,
  organizeChallenge,
};

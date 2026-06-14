const { Match, Table, User, Booking } = require('../../infrastructure/database/models');

const createMatch = async (req, res) => {
  try {
    const { 
      tableId, 
      poolHallId, 
      player1Id, 
      player1Name, 
      player2Id, 
      player2Name, 
      bookingId 
    } = req.body;

    const match = await Match.create({
      tableId,
      poolHallId,
      player1Id,
      player1Name,
      player2Id,
      player2Name,
      bookingId,
      status: 'live',
      startTime: new Date()
    });

    // Update table status if it was from a booking or started directly
    await Table.update({ status: 'occupied' }, { where: { id: tableId } });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMatches = async (req, res) => {
  try {
    const { hallId } = req.query;
    const matches = await Match.findAll({
      where: { poolHallId: hallId },
      include: [
        { model: Table, as: 'table', attributes: ['number'] },
        { model: User, as: 'player1', attributes: ['name', 'avatar'] },
        { model: User, as: 'player2', attributes: ['name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { score1, score2, status } = req.body;

    const match = await Match.findByPk(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (score1 !== undefined) match.score1 = score1;
    if (score2 !== undefined) match.score2 = score2;
    if (status) {
      match.status = status;
      if (status === 'finished') {
        match.endTime = new Date();
        // Set table to available when match finishes
        await Table.update({ status: 'available' }, { where: { id: match.tableId } });
      }
    }

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMatch,
  getMatches,
  updateMatchScore,
};

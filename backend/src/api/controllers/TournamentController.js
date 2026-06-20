const { Tournament, TournamentPlayer, User, PoolHall } = require('../../infrastructure/database/models');

const createTournament = async (req, res) => {
  try {
    const { name, size, entryFee, poolHallId } = req.body;
    
    // In a real scenario, you'd check if the user making the request is the owner of the poolHall
    // For now, we'll assume the request is authorized or we can just create it.
    
    const tournament = await Tournament.create({
      name,
      size,
      entryFee,
      poolHallId,
      status: 'upcoming'
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
};

const getTournaments = async (req, res) => {
  try {
    const { poolHallId } = req.query;
    
    const whereClause = {};
    if (poolHallId) {
      whereClause.poolHallId = poolHallId;
    }

    const tournaments = await Tournament.findAll({
      where: whereClause,
      include: [
        {
          model: TournamentPlayer,
          as: 'players',
          include: [
            {
              model: User,
              as: 'player',
              attributes: ['id', 'email', 'name', 'avatar']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

const joinTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming userId is passed in body for now, or from req.user

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const existingEntry = await TournamentPlayer.findOne({
      where: { tournamentId: id, playerId: userId }
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'User has already joined or requested to join this tournament' });
    }

    const entry = await TournamentPlayer.create({
      tournamentId: id,
      playerId: userId,
      status: 'pending'
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error joining tournament:', error);
    res.status(500).json({ error: 'Failed to join tournament' });
  }
};

const addPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const existingEntry = await TournamentPlayer.findOne({
      where: { tournamentId: id, playerId }
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'Player is already in this tournament' });
    }

    const entry = await TournamentPlayer.create({
      tournamentId: id,
      playerId,
      status: 'approved'
    });

    const entryWithUser = await TournamentPlayer.findByPk(entry.id, {
      include: [{ model: User, as: 'player', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(entryWithUser);
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
};

const updatePlayerStatus = async (req, res) => {
  try {
    const { id, playerId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const entry = await TournamentPlayer.findOne({
      where: { tournamentId: id, playerId }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Player entry not found' });
    }

    entry.status = status;
    await entry.save();

    res.status(200).json(entry);
  } catch (error) {
    console.error('Error updating player status:', error);
    res.status(500).json({ error: 'Failed to update player status' });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size, entryFee } = req.body;

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    tournament.name = name !== undefined ? name : tournament.name;
    tournament.size = size !== undefined ? size : tournament.size;
    tournament.entryFee = entryFee !== undefined ? entryFee : tournament.entryFee;
    
    // Automatically recalculate prize pool if fee changed or just simple update
    // Let's say prizePool is computed from size * entryFee or manual, let's keep it manual/simple for now
    await tournament.save();

    res.status(200).json(tournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findByPk(id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Delete associated tournament players first
    await TournamentPlayer.destroy({
      where: { tournamentId: id }
    });

    await tournament.destroy();

    res.status(200).json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  joinTournament,
  addPlayer,
  updatePlayerStatus,
  updateTournament,
  deleteTournament
};

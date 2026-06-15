const { User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const { role } = req.user;

    let where = {};
    
    // Admin can see everyone, Owner can only see players
    if (role === 'owner') {
      where.role = 'player';
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'avatar', 'role'],
      limit: 20
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRankings = async (req, res) => {
  try {
    const rankings = await User.findAll({
      where: { role: 'player' },
      attributes: ['id', 'name', 'avatar', 'wins', 'losses', 'rating'],
      order: [
        ['rating', 'DESC'],
        ['wins', 'DESC']
      ],
      limit: 50
    });
    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'wins', 'losses', 'rating', 'unpaidCount']
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate rank if player
    let rank = null;
    if (user.role === 'player') {
      rank = await User.count({
        where: {
          role: 'player',
          [Op.or]: [
            { rating: { [Op.gt]: user.rating } },
            { 
              [Op.and]: [
                { rating: user.rating },
                { wins: { [Op.gt]: user.wins } }
              ]
            }
          ]
        }
      }) + 1;
    }

    res.json({ ...user.toJSON(), rank });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'avatar', 'role', 'wins', 'losses', 'rating']
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate rank if player
    let rank = null;
    if (user.role === 'player') {
      rank = await User.count({
        where: {
          role: 'player',
          [Op.or]: [
            { rating: { [Op.gt]: user.rating } },
            { 
              [Op.and]: [
                { rating: user.rating },
                { wins: { [Op.gt]: user.wins } }
              ]
            }
          ]
        }
      }) + 1;
    }

    res.json({ ...user.toJSON(), rank });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  getRankings,
  getProfile,
  getUserProfile,
};

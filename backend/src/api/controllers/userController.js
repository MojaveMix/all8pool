const bcrypt = require("bcryptjs");
const { User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const { role } = req.user;

    let where = {};

    // Admin can see everyone, Owner and Player can only see players
    if (role === 'owner' || role === 'player') {
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
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'status'],
      limit: 50,
      order: [['createdAt', 'DESC']]
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
      attributes: ['id', 'name', 'avatar', 'wins', 'losses', 'rating', 'virtualMoney', 'points'],
      order: [
        ['points', 'DESC'], // Primary ranking by points
        ['virtualMoney', 'DESC'], 
        ['rating', 'DESC']
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
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'wins', 'losses', 'rating', 'unpaidCount', 'virtualMoney', 'points']
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate rank if player (rank by points)
    let rank = null;
    if (user.role === 'player') {
      rank = await User.count({
        where: {
          role: 'player',
          [Op.or]: [
            { points: { [Op.gt]: user.points } },
            { 
              [Op.and]: [
                { points: user.points },
                { virtualMoney: { [Op.gt]: user.virtualMoney } }
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
    
    // Basic check for UUID format if possible, or just let findByPk handle it
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'wins', 'losses', 'rating', 'virtualMoney', 'points']
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate rank if player
    let rank = null;
    if (user.role === 'player') {
      rank = await User.count({
        where: {
          role: 'player',
          [Op.or]: [
            { points: { [Op.gt]: user.points } },
            { 
              [Op.and]: [
                { points: user.points },
                { virtualMoney: { [Op.gt]: user.virtualMoney } }
              ]
            }
          ]
        }
      }) + 1;
    }

    res.json({ ...user.toJSON(), rank });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.name === 'SequelizeDatabaseError' && error.parent.code === '22P02') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'owner', 'player'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'player',
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from suspending themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    user.status = status;
    await user.save();

    res.json({ message: 'User status updated successfully', user: { id: user.id, status: user.status } });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const { Match, PoolHall } = require('../../infrastructure/database/models');
    
    const playersCount = await User.count({ where: { role: 'player' } });
    const matchesCount = await Match.count();
    const hallsCount = await PoolHall.count();

    res.json({
      players: playersCount + 1500, // Base + actual for a more "populated" feel
      matches: matchesCount + 12000,
      halls: hallsCount + 45
    });
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
  getGlobalStats,
  updateUserRole,
  createUser,
  updateUserStatus,
  deleteUser
};

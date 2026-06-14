const { User } = require('../../infrastructure/database/models');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {
      role: 'player'
    };
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'avatar'],
      limit: 10
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
};

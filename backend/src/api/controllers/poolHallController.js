const { PoolHall, Table } = require('../../infrastructure/database/models');

const createPoolHall = async (req, res) => {
  try {
    const { name, address, city, phone, description, openingTime, closingTime } = req.body;
    const poolHall = await PoolHall.create({
      name,
      address,
      city,
      phone,
      description,
      openingTime,
      closingTime,
      ownerId: req.user.id,
    });
    res.status(201).json(poolHall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPoolHalls = async (req, res) => {
  try {
    const poolHalls = await PoolHall.findAll({
      where: { ownerId: req.user.id },
      include: [{ model: Table, as: 'tables' }],
    });
    res.json(poolHalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPoolHalls = async (req, res) => {
  try {
    const poolHalls = await PoolHall.findAll();
    res.json(poolHalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPoolHall,
  getMyPoolHalls,
  getAllPoolHalls,
};

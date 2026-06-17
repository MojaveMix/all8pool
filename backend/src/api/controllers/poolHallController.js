const { PoolHall, Table } = require('../../infrastructure/database/models');

const createPoolHall = async (req, res) => {
  try {
    const { name, address, city, phone, description, openingTime, closingTime, currency } = req.body;
    const poolHall = await PoolHall.create({
      name,
      address,
      city,
      phone,
      description,
      openingTime,
      closingTime,
      currency,
      ownerId: req.user.id,
    });
    res.status(201).json(poolHall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMyPoolHalls = async (req, res) => {
  try {
    const { role, id } = req.user;
    let where = {};

    // Admin sees all, Owner sees only theirs
    if (role === 'owner') {
      where.ownerId = id;
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const poolHalls = await PoolHall.findAll({
      where,
      include: [{ model: Table, as: 'tables' }],
    });
    res.json(poolHalls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPoolHalls = async (req, res) => {
  try {
    const poolHalls = await PoolHall.findAll({
      include: [{ model: Table, as: 'tables' }],
    });
    res.json(poolHalls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePoolHall = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, address, city, phone, description, 
      openingTime, closingTime, 
      promotionType, promotionValue,
      currency
    } = req.body;

    const poolHall = await PoolHall.findByPk(id);
    if (!poolHall) return res.status(404).json({ message: 'Pool Hall not found' });

    // Check ownership
    if (req.user.role === 'owner' && poolHall.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await poolHall.update({
      name, address, city, phone, description, 
      openingTime, closingTime, 
      promotionType, promotionValue,
      currency
    });

    res.json(poolHall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPoolHall,
  getMyPoolHalls,
  getAllPoolHalls,
  updatePoolHall,
};

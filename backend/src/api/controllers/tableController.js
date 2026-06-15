const { Table, PoolHall } = require('../../infrastructure/database/models');

const addTable = async (req, res) => {
  try {
    const { poolHallId, number, type, pricePerHour } = req.body;
    
    // Check if user owns the pool hall
    const poolHall = await PoolHall.findOne({ where: { id: poolHallId, ownerId: req.user.id } });
    if (!poolHall) {
      return res.status(403).json({ message: 'Not authorized to manage this pool hall' });
    }

    const table = await Table.create({
      poolHallId,
      number,
      type,
      pricePerHour,
    });
    res.status(201).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { status } = req.body;
    
    const table = await Table.findByPk(tableId, {
      include: [{ model: PoolHall, as: 'poolHall' }]
    });

    if (!table || table.poolHall.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    table.status = status;
    await table.save();

    // TODO: Emit socket event for live status update
    
    res.json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addTable,
  updateTableStatus,
};

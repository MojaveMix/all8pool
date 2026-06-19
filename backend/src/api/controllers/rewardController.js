const { Reward, User, PoolHall } = require('../../infrastructure/database/models');

const getRewards = async (req, res) => {
  try {
    const { hallId } = req.query;
    const where = {};
    if (hallId) {
      where.poolHallId = hallId;
    } else {
      where.poolHallId = null; // Global rewards
    }

    const rewards = await Reward.findAll({
      where,
      include: [{ model: PoolHall, as: 'poolHall', attributes: ['name'] }]
    });
    res.json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createReward = async (req, res) => {
  try {
    const { name, description, cost, category, poolHallId, image } = req.body;

    // Check if owner owns the hall
    if (req.user.role === 'owner') {
      if (!poolHallId) {
        return res.status(403).json({ message: 'Owners can only create rewards for their own pool halls' });
      }
      const hall = await PoolHall.findOne({ where: { id: poolHallId, ownerId: req.user.id } });
      if (!hall) return res.status(403).json({ message: 'You do not own this pool hall' });
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reward = await Reward.create({
      name,
      description,
      cost,
      category,
      poolHallId,
      image
    });

    res.status(201).json(reward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.params;
    const user = await User.findByPk(req.user.id);
    const reward = await Reward.findByPk(rewardId);

    if (!reward) return res.status(404).json({ message: 'Reward not found' });
    if (user.virtualMoney < reward.cost) {
      return res.status(400).json({ message: 'Insufficient virtual money' });
    }

    user.virtualMoney -= reward.cost;
    await user.save();

    // In a real app, we would create a transaction record or a UserReward record
    // For now, we just deduct and return success
    res.json({ message: 'Reward redeemed successfully', balance: user.virtualMoney });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRewards,
  createReward,
  redeemReward,
};

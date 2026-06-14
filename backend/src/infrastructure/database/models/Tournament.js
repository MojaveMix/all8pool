const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poolHallId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, // 8, 16, 32
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'finished'),
    defaultValue: 'upcoming',
  },
  entryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  prizePool: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  winnerId: {
    type: DataTypes.UUID,
  },
  bracketData: {
    type: DataTypes.JSON, // Stores the bracket structure and results
  },
}, {
  timestamps: true,
});

module.exports = Tournament;

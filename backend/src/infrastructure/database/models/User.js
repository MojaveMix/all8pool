const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('player', 'owner', 'admin'),
    defaultValue: 'player',
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended'),
    defaultValue: 'active',
  },
  avatar: {
    type: DataTypes.STRING,
  },
  wins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  losses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 3.00,
  },
  unpaidCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  virtualMoney: {
    type: DataTypes.INTEGER,
    defaultValue: 1000, // Initial balance
  },
  lastBonusDate: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

module.exports = User;

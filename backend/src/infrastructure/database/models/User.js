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
  avatar: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

module.exports = User;

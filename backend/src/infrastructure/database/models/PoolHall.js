const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const PoolHall = sequelize.define('PoolHall', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  openingTime: {
    type: DataTypes.STRING, // e.g., "09:00"
  },
  closingTime: {
    type: DataTypes.STRING, // e.g., "23:00"
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
  },
  promotionType: {
    type: DataTypes.ENUM('none', 'percentage', 'free'),
    defaultValue: 'none',
  },
  promotionValue: {
    type: DataTypes.INTEGER, // e.g., 10, 50, 60
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = PoolHall;

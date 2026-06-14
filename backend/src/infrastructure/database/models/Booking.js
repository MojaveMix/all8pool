const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  player1Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  player2Id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  player2Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tables',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  timestamps: true,
});

module.exports = Booking;

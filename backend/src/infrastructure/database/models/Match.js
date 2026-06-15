const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  player1Id: {
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
  poolHallId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'PoolHalls',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Bookings',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  score1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('open', 'matched', 'live', 'finished', 'cancelled'),
    defaultValue: 'open',
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
  },
  winnerId: {
    type: DataTypes.UUID,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  appliedPromotion: {
    type: DataTypes.STRING,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Match;

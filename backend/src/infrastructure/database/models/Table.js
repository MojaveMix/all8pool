const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('8-ball', '9-ball', 'snooker'),
    defaultValue: '8-ball',
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'soon_available', 'maintenance'),
    defaultValue: 'available',
  },
  pricePerHour: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
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
}, {
  timestamps: true,
});

module.exports = Table;

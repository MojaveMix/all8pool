const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const TournamentPlayer = sequelize.define('TournamentPlayer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tournamentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = TournamentPlayer;

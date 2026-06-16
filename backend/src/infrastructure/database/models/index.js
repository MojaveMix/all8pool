const User = require("./User");
const PoolHall = require("./PoolHall");
const Table = require("./Table");
const Booking = require("./Booking");
const Match = require("./Match");
const Tournament = require("./Tournament");
const Reward = require("./Reward");

// User <-> PoolHall (Owner)
User.hasMany(PoolHall, { foreignKey: "ownerId", as: "poolHalls" });
PoolHall.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// PoolHall <-> Table
PoolHall.hasMany(Table, { foreignKey: "poolHallId", as: "tables" });
Table.belongsTo(PoolHall, { foreignKey: "poolHallId", as: "poolHall" });

// Table <-> Booking
Table.hasMany(Booking, { foreignKey: "tableId", as: "bookings" });
Booking.belongsTo(Table, { foreignKey: "tableId", as: "table" });

// User <-> Booking
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookingsAsPlayer1",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
User.hasMany(Booking, {
  foreignKey: "player2Id",
  as: "bookingsAsPlayer2",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Booking.belongsTo(User, {
  foreignKey: "player2Id",
  as: "player2",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// PoolHall <-> Match
PoolHall.hasMany(Match, {
  foreignKey: "poolHallId",
  as: "matches",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Match.belongsTo(PoolHall, {
  foreignKey: "poolHallId",
  as: "poolHall",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Table <-> Match
Table.hasMany(Match, {
  foreignKey: "tableId",
  as: "matches",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Match.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Booking <-> Match
Booking.hasOne(Match, {
  foreignKey: "bookingId",
  as: "match",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Match.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// User <-> Match
User.hasMany(Match, {
  foreignKey: "player1Id",
  as: "matchesAsPlayer1",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
User.hasMany(Match, {
  foreignKey: "player2Id",
  as: "matchesAsPlayer2",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Match.belongsTo(User, {
  foreignKey: "player1Id",
  as: "player1",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Match.belongsTo(User, {
  foreignKey: "player2Id",
  as: "player2",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

// PoolHall <-> Tournament
PoolHall.hasMany(Tournament, { foreignKey: "poolHallId", as: "tournaments" });
Tournament.belongsTo(PoolHall, { foreignKey: "poolHallId", as: "poolHall" });

// PoolHall <-> Reward
PoolHall.hasMany(Reward, { foreignKey: "poolHallId", as: "rewards" });
Reward.belongsTo(PoolHall, { foreignKey: "poolHallId", as: "poolHall" });

module.exports = {
  User,
  PoolHall,
  Table,
  Booking,
  Match,
  Tournament,
  Reward,
};

const { sequelize } = require('./backend/src/infrastructure/database/database');
const { Booking } = require('./backend/src/infrastructure/database/models');
const { Op } = require('sequelize');

async function run() {
  const startTime = '2026-06-17T12:00:00.000Z';
  const endTime = '2026-06-17T13:00:00.000Z';
  const tableId = "1";
  
  const existingBooking = await Booking.findOne({
      where: {
        tableId,
        status: { [Op.not]: 'cancelled' },
        [Op.and]: [
          { startTime: { [Op.lt]: endTime } },
          { endTime: { [Op.gt]: startTime } }
        ]
      }
    });

  console.log("Existing booking found:", !!existingBooking);
  process.exit(0);
}
run();
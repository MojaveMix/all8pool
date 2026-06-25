const rateLimit = require('express-rate-limit');

// Strict limit on credentials routes (login/register) - max 30 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes.' }
});

// Prevent booking reservation spamming (max 10 reservation creation requests per 15 minutes)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many reservations created from this IP. Please wait a few minutes before trying again.' }
});

// Prevent challenge/joining spam (max 15 requests per 15 minutes)
const challengeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many challenge actions performed. Please slow down.' }
});

module.exports = {
  authLimiter,
  bookingLimiter,
  challengeLimiter
};

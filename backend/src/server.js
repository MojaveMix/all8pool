const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { sequelize, connectDB } = require('./infrastructure/database/database');
const models = require('./infrastructure/database/models');

const app = express();
const server = http.createServer(app);

// ... rest of the code ...

// Connect to Database
connectDB();

// Sync Database (In production, use migrations)
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
  });
}
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./api/routes/authRoutes'));
app.use('/api/users', require('./api/routes/userRoutes'));
app.use('/api/pool-halls', require('./api/routes/poolHallRoutes'));
app.use('/api/tables', require('./api/routes/tableRoutes'));
app.use('/api/bookings', require('./api/routes/bookingRoutes'));
app.use('/api/matches', require('./api/routes/matchRoutes'));
app.use('/api/dashboard', require('./api/routes/dashboardRoutes'));
app.use('/api/rewards', require('./api/routes/rewardRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Routes Placeholder
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'All 8 Pool API is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };

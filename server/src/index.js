const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const ensureDefaultAdmin = require('./seed/ensureDefaultAdmin');
const seedMenu = require('./seed/menuSeed');
const { attachWebSocketServer } = require('./ws/broadcast');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
attachWebSocketServer(server);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Run startup seed tasks (Prisma uses DATABASE_URL)
ensureDefaultAdmin().catch((err) => {
  console.error('Error ensuring default admin:', err);
});

seedMenu().catch((err) => {
  console.error('Error seeding menu:', err);
});

app.get('/', (req, res) => {
  res.json({ message: 'Delicious Bites API is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/orders', require('./routes/adminOrders'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


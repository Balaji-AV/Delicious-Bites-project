const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const ensureDefaultAdmin = require('./seed/ensureDefaultAdmin');
const seedMenu = require('./seed/menuSeed');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


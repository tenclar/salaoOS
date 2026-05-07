// src/index.js - Backend entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const knexConfig = require('./config/db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const professionalRoutes = require('./routes/professionals');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const appointmentRoutes = require('./routes/appointments');
const packageRoutes = require('./routes/packages');
const financeRoutes = require('./routes/finance');
const roleRoutes = require('./routes/roles');
const roomRoutes = require('./routes/rooms');
const orderRoutes = require('./routes/orders');
const cashSessionRoutes = require('./routes/cash_sessions');
const professionalPaymentRoutes = require('./routes/professional_payments');
const dashboardRoutes = require('./routes/dashboard');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cash-sessions', cashSessionRoutes);
app.use('/api/professional-payments', professionalPaymentRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

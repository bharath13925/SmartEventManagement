const express = require('express');  // <-- You were missing this line too!
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require('body-parser');

require('dotenv').config();

const userRoutes = require('./routes/users');
const organizerRoutes = require('./routes/organizers');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const registrationStatsRouter = require('./routes/RegistrationStats');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/smart-event-db')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mounting routes
app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/stats', registrationStatsRouter);




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

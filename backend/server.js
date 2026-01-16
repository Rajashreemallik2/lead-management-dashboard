const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const leadsRoute = require('./routes/leads');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/leads', leadsRoute);


// test route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

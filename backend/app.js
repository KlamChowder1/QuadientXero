require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xeroRoutes = require('./routes/xeroRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', xeroRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

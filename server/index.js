const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const logger = require('./middleware/logger');
const applicantsRoutes = require('./routes/applicants');
const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/api/applicants', applicantsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Pending Employee Relations")
}); 
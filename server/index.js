const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const logger = require('./middleware/logger');

const applicantsRoutes = require('./routes/applicants');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/api/applicants', applicantsRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
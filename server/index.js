const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const logger = require('./middleware/logger');
const applicantsRoutes = require('./routes/applicants');
const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const principalsRoutes = require('./routes/principals');
const masterlistRoutes = require('./routes/masterlist');

const app = express();

app.use(cors());
// Default JSON limit is 100kb — the bulk import posts ~250 applicant rows per
// request, which exceeds it. 10mb comfortably covers 500-row chunks.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);

app.use('/api/applicants', applicantsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/principals', principalsRoutes);
app.use('/api/masterlist', masterlistRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Pending Employee Relations")
}); 
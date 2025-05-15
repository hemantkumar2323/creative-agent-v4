=== index.js - CREATIVE AGENT ===
```javascript
require('dotenv').config();
const express = require('express');
const app = express();
const { logToFile, logger } = require('./utils/logger'); // Import logger
const { handleError } = require('./utils/errorHandling');
require('express-async-errors');

app.use(express.json());

app.use('/api/generate', require('./api/generate'));
app.use('/api/remix', require('./api/remix'));
app.use('/api/score', require('./api/score'));

// Global error handler
app.use(handleError);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`CreativeAgent listening on port ${PORT}`)); // Use Winston

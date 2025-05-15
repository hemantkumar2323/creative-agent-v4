=== api/generate.js ===
```javascript
const express = require('express');
const router = express.Router();
const { generateScript } = require('../generators/scriptGenerator');
const { logToFile, logger } = require('../utils/logger'); // Use the logger

router.post('/', async (req, res) => {
  const { trend, niche } = req.body;
  if (!trend || !niche) {
    return res.status(400).json({ success: false, error: 'Both trend and niche are required.' });
  }

  try {
    const result = await generateScript({ niche, hook: trend.hook, cta: trend.cta, baseIdea: trend.title, fewShot: trend.fewShot || [] });
    res.json({ success: true, script: result });
  } catch (err) {
    logger.error({ message: 'Error generating script', error: err, requestBody: req.body }); // Log with Winston
    res.status(500).json({ success: false, error: 'Failed to generate script: ' + err.message });
  }
});

module.exports = router;

=== api/score.js ===
```javascript
const express = require('express');
const router = express.Router();
const { scoreScript } = require('../scorers/scriptScorer');
const { logToFile, logger } = require('../utils/logger'); // Use the logger

router.post('/', (req, res) => {
  const { script } = req.body;
    if (!script) {
        return res.status(400).json({success: false, error: "Script is required."})
    }
  try {
    const result = scoreScript(script);
    res.json({ success: true, score: result });
  } catch (err) {
    logger.error({ message: 'Error scoring script', error: err, requestBody: req.body }); // Use Winston
    res.status(500).json({ success: false, error: 'Failed to score script: ' + err.message });
  }
});

module.exports = router;

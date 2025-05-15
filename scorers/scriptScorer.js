=== scorers/scriptScorer.js ===
```javascript
const { logToFile, logger } = require('../utils/logger'); // Use the logger

// const confPath = path3.join(__dirname, '../memory/confidence-scores.json'); // No longer used

function scoreScript(script) {
  let score = 50;
  if (script.tone.includes('emotional')) score += 10;
  if (script.structure.includes('Hope')) score += 10;
  if (script.hook.includes('you')) score += 10;
  if (script.cta && script.cta.length > 10) score += 10;
  if (script.script.length > 150) score += 5;
  if (script.hook.includes('trauma') || script.tone.includes('abuse')) score = Math.min(score, 80);
  const decision = score >= 85 ? 'auto' : 'manual';
  const result = { ...script, score, decision };

  // Store score in database.
  /*
  try{
    const newScoreId = await db.insert('scores', result);
    logger.info({message: "Script score saved", scoreId: newScoreId, scriptScore: score, decision: decision });
  } catch(error){
    logger.error({message: "Error saving script score to DB", error: error, scoreData: result})
  }
  */
  logger.info({ message: 'Script scored', score: score, decision: decision, script: script.script });
  return result;
}

module.exports = { scoreScript };

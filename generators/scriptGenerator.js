=== generators/scriptGenerator.js ===
```javascript
const { selectBestTone } = require('../utils/toneSelector');
const { selectBestStructure } = require('../utils/structureSelector');
const { buildPrompt } = require('../utils/promptBuilder');
const { logToFile, logger } = require('../utils/logger'); // Use the logger
const { OpenAI } = require('openai'); // Import OpenAI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateFromLLM(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or your preferred model
      messages: [
        { role: 'user', content: prompt },
      ],
      max_tokens: 200, // Adjust as needed
    });
    const script = response.choices[0].message.content;
    return script;
  } catch (error) {
    logger.error({ message: 'LLM (OpenAI) call failed', error: error, prompt: prompt });
    throw new Error('Failed to generate script from LLM: ' + error.message);
  }
}

async function generateScript({ niche, hook, cta, baseIdea, fewShot = [] }) {
  const tone = selectBestTone(niche);
  const structure = selectBestStructure(niche);
  const prompt = buildPrompt({ tone, structure, niche, hook, cta, fewShot, baseIdea });
  const script = await generateFromLLM(prompt);
  const result = {
    niche,
    hook,
    cta,
    tone,
    structure,
    prompt,
    script,
    createdAt: new Date().toISOString(),
  };

  // Consider storing in a database instead of a file
  // (Example using a hypothetical 'db' object)
  /*
  try {
    const newScriptId = await db.insert('scripts', result);
    result.id = newScriptId; // Add the generated ID to the result
    logger.info({message: "Script saved to database", scriptId: newScriptId})
  } catch (dbError) {
    logger.error({ message: 'Database error saving script', error: dbError, scriptData: result });
    // Don't throw here, keep going, but log the error
  }
  */
  logToFile('scriptGenerator.log', `Script generated for ${niche}`);
  return result;
}

module.exports = { generateScript };

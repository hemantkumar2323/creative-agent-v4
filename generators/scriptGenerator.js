// generators/scriptGenerator.js - CREATIVE AGENT

const { selectBestTone } = require('../utils/toneSelector');
const { selectBestStructure } = require('../utils/structureSelector');
const { buildPrompt } = require('../utils/promptBuilder');
const { logToFile } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Simulated LLM call (replace with OpenAI or actual agent logic)
async function generateFromLLM(prompt) {
  return `Generated Script Based On:\n${prompt}`;
}

async function generateScript({ niche, hook, cta, baseIdea, fewShot = [] }) {
  try {
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
      createdAt: new Date().toISOString()
    };

    const savePath = path.join(__dirname, '../output/generated-script.json');
    fs.writeFileSync(savePath, JSON.stringify(result, null, 2));
    logToFile('scriptGenerator.log', `Script generated for ${niche}`);

    return result;
  } catch (err) {
    logToFile('scriptGenerator.log', `Error generating script: ${err.message}`);
    throw err;
  }
}

module.exports = {
  generateScript
};

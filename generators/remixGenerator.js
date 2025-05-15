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

// generators/remixGenerator.js - CREATIVE AGENT

const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger');

// Simulated GPT remix prompt builder
async function remixScript(original, newHook, newTone, structure = 'Hook → Problem → CTA') {
  return [
    `New Hook: ${newHook}`,
    `New Tone: ${newTone}`,
    `Structure: ${structure}`,
    `Original Script:`,
    original,
    `\nInstruction: Maintain meaning. Update tone and hook. Keep it under 30 seconds.`
  ].join('\n');
}

async function generateRemix({ niche, originalPath, newHook, newTone, structure }) {
  try {
    const inputPath = path.join(__dirname, originalPath);
    const originalScript = fs.readFileSync(inputPath, 'utf8');
    const remixedScript = await remixScript(originalScript, newHook, newTone, structure);

    const output = {
      niche,
      newHook,
      newTone,
      structure,
      remixedScript,
      remixedAt: new Date().toISOString()
    };

    const outputPath = path.join(__dirname, '../output/remixed-script.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    logToFile('remixGenerator.log', `Remix complete for ${niche}`);

    return output;
  } catch (err) {
    logToFile('remixGenerator.log', `Remix error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  generateRemix
};

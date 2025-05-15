// utils/logger.js

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function logToFile(filename, message) {
  const logPath = path.join(logDir, filename);
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, logMessage, 'utf8');
}

function logJSON(filename, data) {
  const filePath = path.join(logDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  logToFile,
  logJSON
};

// utils/promptBuilder.js

function buildPrompt({ tone, structure, niche, hook, cta, fewShot = [], baseIdea }) {
  const lines = [];

  if (fewShot.length) {
    lines.push("### Examples:");
    fewShot.forEach((ex, i) => {
      lines.push(`Example ${i + 1}:\n${ex}`);
    });
    lines.push("\n### Now generate a new script:");
  }

  lines.push(`Niche: ${niche}`);
  lines.push(`Tone: ${tone}`);
  lines.push(`Structure: ${structure}`);
  lines.push(`Hook: ${hook}`);
  lines.push(`CTA: ${cta}`);
  lines.push(`Main idea: ${baseIdea}`);

  lines.push("Write in short sentences, split across 3–4 lines, perfect for reels.");

  return lines.join("\n");
}

module.exports = {
  buildPrompt
};

// utils/toneSelector.js

const fs = require('fs');
const path = require('path');
const toneBankPath = path.join(__dirname, '../memory/tone-bank.json');

function selectBestTone(niche) {
  const tones = JSON.parse(fs.readFileSync(toneBankPath, 'utf8'));
  const nicheTones = tones[niche] || [];
  const sorted = nicheTones.sort((a, b) => b.avgSaveRate - a.avgSaveRate);
  return sorted.length ? sorted[0].tone : 'neutral & clear';
}

module.exports = {
  selectBestTone
};

// utils/structureSelector.js

const fs = require('fs');
const path = require('path');
const structureBankPath = path.join(__dirname, '../memory/structure-bank.json');

function selectBestStructure(niche) {
  const structures = JSON.parse(fs.readFileSync(structureBankPath, 'utf8'));
  const nicheStructures = structures[niche] || [];
  const sorted = nicheStructures.sort((a, b) => b.completionRate - a.completionRate);
  return sorted.length ? sorted[0].structure : 'Hook → Problem → Hope';
}

module.exports = {
  selectBestStructure
};

=== utils/structureSelector.js ===
```javascript
const fs = require('fs');
const path = require('path');
const { logToFile, logger } = require('./logger'); // Use the logger
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const STRUCTURE_BANK = {
  femspeak: [
    { structure: "Hook → Problem → Solution → CTA", completionRate: 0.9 },
    { structure: "Hook → Story → CTA", completionRate: 0.7 },
  ],
  mindtonic: [
    { structure: "Hook → Explanation → Insight → CTA", completionRate: 0.95 },
    { structure: "Hook → Question → Answer → CTA", completionRate: 0.85 },
  ],
  cozyhouse: [
    { structure: "Hook → Demonstration → Result → CTA", completionRate: 0.92 },
    { structure: "Hook → Personal Story → Lesson → CTA", completionRate: 0.88 },
  ],
  luxeloop: [
    { structure: "Hook → Aspiration → How-to → CTA", completionRate: 0.94 },
    { structure: "Hook → Expert Opinion → Benefit → CTA", completionRate: 0.9 },
  ],
};

async function getStructureRecommendation(niche, existingStructures) {
  try {
    const prompt = `
      Given the social media niche "${niche}" and the following existing structures with their performance:
      ${JSON.stringify(existingStructures)}
      Recommend the best structure for a new video script in this niche.
      Respond with only the structure, do not add any additional text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });
    const recommendedStructure = response.choices[0].message.content.trim();
    return recommendedStructure;
  } catch (error) {
    logger.error({
      message: "Error getting structure recommendation from LLM",
      error: error,
      niche: niche,
      existingStructures: existingStructures,
    });
    return "Hook → Problem → Hope";
  }
}


function selectBestStructure(niche) {
  const nicheStructures = STRUCTURE_BANK[niche] || [];
  if (nicheStructures.length > 0) {
    const sortedStructures = nicheStructures.sort(
      (a, b) => b.completionRate - a.completionRate
    );
    return sortedStructures[0].structure;
  }
  return getStructureRecommendation(niche, nicheStructures);
}

module.exports = { selectBestStructure };

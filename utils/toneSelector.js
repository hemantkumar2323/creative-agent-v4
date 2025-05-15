=== utils/toneSelector.js ===
```javascript
const { logToFile, logger } = require('../utils/logger'); // Import the logger
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TONE_BANK = {
  femspeak: [
    { tone: "Empowering and Motivational", avgSaveRate: 0.8 },
    { tone: "Humorous and Relatable", avgSaveRate: 0.6 },
  ],
  mindtonic: [
    { tone: "Calm and Informative", avgSaveRate: 0.9 },
    { tone: "Intriguing and Mysterious", avgSaveRate: 0.7 },
  ],
  cozyhouse: [
    { tone: "Warm and Nostalgic", avgSaveRate: 0.95 },
    { tone: "Playful and Energetic", avgSaveRate: 0.8 },
  ],
  luxeloop: [
    { tone: "Sophisticated and Aspirational", avgSaveRate: 0.9 },
    { tone: "Exclusive and Informative", avgSaveRate: 0.75 },
  ],
};

async function getToneRecommendation(niche, existingTones) {
  try {
    const prompt = `
      Given the social media niche "${niche}" and the following existing tones with their performance:
      ${JSON.stringify(existingTones)}
      Recommend the best tone for a new video script in this niche.  
      Respond with only the tone, do not add any additional text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });
    const recommendedTone = response.choices[0].message.content.trim();
    return recommendedTone;
  } catch (error) {
    logger.error({
      message: "Error getting tone recommendation from LLM",
      error: error,
      niche: niche,
      existingTones: existingTones,
    });
    return "Neutral and Clear";
  }
}


function selectBestTone(niche) {
  const nicheTones = TONE_BANK[niche] || [];
  if (nicheTones.length > 0) {
    const sortedTones = nicheTones.sort((a, b) => b.avgSaveRate - a.avgSaveRate);
    return sortedTones[0].tone;
  }
  //If tone is not in our tone bank, ask LLM
  return getToneRecommendation(niche, nicheTones);
}

module.exports = { selectBestTone };

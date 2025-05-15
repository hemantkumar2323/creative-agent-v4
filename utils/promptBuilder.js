=== utils/promptBuilder.js ===
```javascript
function buildPrompt({ tone, structure, niche, hook, cta, fewShot = [], baseIdea }) {
  const lines = [];
  if (fewShot.length) {
    lines.push('### Examples:');
    fewShot.forEach((ex, i) => lines.push(`Example ${i + 1}:\n${ex}`));
    lines.push('\n### Now generate a new script:');
  }
  lines.push(`Niche: ${niche}`);
  lines.push(`Tone: ${tone}`);
  lines.push(`Structure: ${structure}`);
  lines.push(`Hook: ${hook}`);
  lines.push(`CTA: ${cta}`);
  lines.push(`Main idea: ${baseIdea}`);
  lines.push('Write in short sentences, split across 3–4 lines, perfect for reels.');
  return lines.join('\n');
}

module.exports = { buildPrompt };

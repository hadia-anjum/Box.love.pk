const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/star/.gemini/antigravity/brain/1f39874e-f9e9-42b5-a65c-cd55dabba802/.user_uploaded';
const files = fs.readdirSync(dir).map(f => {
  const stat = fs.statSync(path.join(dir, f));
  return { name: f, size: stat.size, mtime: stat.mtime };
}).sort((a,b) => b.mtime - a.mtime);

console.log(JSON.stringify(files.slice(0, 10), null, 2));

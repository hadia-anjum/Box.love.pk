const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix line 2478
const oldLine1 = 'onClick={() => setActiveReviewImg(selectedTheme.image)}';
const newLine1 = 'onClick={() => setActiveReviewImg(selectedTheme.image || null)}';

// 2. Fix line 2609
// (Wait, since we replace oldLine1, and both instances are exactly the same string, we can do it by replacing all occurrences or targeting specifically.)
content = content.replace(/onClick=\{\(\) => setActiveReviewImg\(selectedTheme\.image\)\}/g, 'onClick={() => setActiveReviewImg(selectedTheme.image || null)}');

// 3. Let's also verify line 2379 is typesafe (it is, but let's change it for uniformity)
content = content.replace('setActiveReviewImg(selectedTheme.image);', 'setActiveReviewImg(selectedTheme.image || null);');

fs.writeFileSync('src/app/page.tsx', content);
console.log('TypeScript error fixed!');

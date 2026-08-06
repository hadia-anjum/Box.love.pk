const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace theme.emoji
content = content.replace(/\{theme\.emoji\}/g, "{\\'emoji\\' in theme ? (theme as any).emoji : \\'🎁\\'}");

// Replace selectedTheme.emoji
content = content.replace(/\{selectedTheme\.emoji\}/g, "{\\'emoji\\' in selectedTheme ? (selectedTheme as any).emoji : \\'🎁\\'}");

fs.writeFileSync('src/app/page.tsx', content);
console.log('Emoji TypeScript errors resolved!');

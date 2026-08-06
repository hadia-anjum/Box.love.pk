const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace escaped single quotes inside JSX expressions
content = content.replace(/\\'emoji\\'/g, "'emoji'");
content = content.replace(/\\'🎁\\'/g, "'🎁'");

fs.writeFileSync('src/app/page.tsx', content);
console.log('JSX escaped quotes fixed successfully!');

const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update Cozy Collection themes
content = content.replace(/{ name: "Books", emoji: "[^"]+" }/g, '{ name: "Books", image: "/collections/books.png" }');
content = content.replace(/{ name: "Candles", emoji: "[^"]+" }/g, '{ name: "Vintage", image: "/collections/vintage.jpg" }');
content = content.replace(/{ name: "Matcha", emoji: "[^"]+" }/g, '{ name: "Matcha", image: "/collections/matcha.jpg" }');

// Update Gaming Collection PlayStation 5 theme
content = content.replace(/{ name: "PlayStation 5", emoji: "[^"]+" }/g, '{ name: "PlayStation 5", image: "/collections/ps5.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Vintage, Books, Matcha, and PlayStation 5 themes updated successfully!');

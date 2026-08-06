const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "Lana Del Rey", emoji: "[^"]+" }/g, '{ name: "Lana Del Rey", image: "/collections/lana_del_rey.jpg" }');
content = content.replace(/{ name: "Porsche", emoji: "[^"]+" }/g, '{ name: "Porsche", image: "/collections/porsche.png" }');
content = content.replace(/{ name: "Makeup", emoji: "[^"]+" }/g, '{ name: "Makeup", image: "/collections/makeup.png" }');
content = content.replace(/{ name: "Kuromi", emoji: "[^"]+" }/g, '{ name: "Kuromi", image: "/collections/kuromi.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Lana Del Rey, Porsche, Makeup, and Kuromi themes updated successfully!');

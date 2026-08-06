const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "Real Madrid", emoji: "[^"]+" }/g, '{ name: "Real Madrid", image: "/collections/real_madrid.png" }');
content = content.replace(/{ name: "Rose", emoji: "[^"]+" }/g, '{ name: "Rose", image: "/collections/rose.png" }');
content = content.replace(/{ name: "Coffee", emoji: "[^"]+" }/g, '{ name: "Coffee", image: "/collections/coffee.png" }');
content = content.replace(/{ name: "Valorant", emoji: "[^"]+" }/g, '{ name: "Valorant", image: "/collections/valorant.png" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Real Madrid, Rose, Coffee, and Valorant themes updated successfully!');

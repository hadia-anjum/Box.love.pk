const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "Mercedes AMG", emoji: "[^"]+" }/g, '{ name: "Mercedes AMG", image: "/collections/mercedes.png" }');
content = content.replace(/{ name: "Manchester City", emoji: "[^"]+" }/g, '{ name: "Manchester City", image: "/collections/manchester_city.png" }');
content = content.replace(/{ name: "Messi", emoji: "[^"]+" }/g, '{ name: "Messi", image: "/collections/messi.jpg" }');
content = content.replace(/{ name: "Moon & Stars", emoji: "[^"]+" }/g, '{ name: "Moon & Stars", image: "/collections/moon_stars.png" }');
content = content.replace(/{ name: "Lilies", emoji: "[^"]+" }/g, '{ name: "Lilies", image: "/collections/lilies.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Lilies, Mercedes, Man City, Messi, and Moon & Stars themes updated!');

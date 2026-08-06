const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "Tulip", emoji: "[^"]+" }/g, '{ name: "Tulip", image: "/collections/tulips.png" }');
content = content.replace(/{ name: "Teddy Bear", emoji: "[^"]+" }/g, '{ name: "Teddy Bear", image: "/collections/teddy_bear.jpg" }');
content = content.replace(/{ name: "Strawberry", emoji: "[^"]+" }/g, '{ name: "Strawberry", image: "/collections/strawberry.jpg" }');
content = content.replace(/{ name: "Sunflower", emoji: "[^"]+" }/g, '{ name: "Sunflower", image: "/collections/sunflower.png" }');
content = content.replace(/{ name: "Spider-Man", emoji: "[^"]+" }/g, '{ name: "Spider-Man", image: "/collections/spiderman.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Tulips, Teddy Bear, Strawberry, Sunflower, and Spider-Man themes updated!');

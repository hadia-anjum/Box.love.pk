const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "Billie Eilish", emoji: "[^"]+" }/g, '{ name: "Billie Eilish", image: "/collections/billie_eilish.png" }');
content = content.replace(/{ name: "BTS", emoji: "[^"]+" }/g, '{ name: "BTS", image: "/collections/bts.jpg" }');
content = content.replace(/{ name: "Naruto", emoji: "[^"]+" }/g, '{ name: "Naruto", image: "/collections/naruto.jpg" }');
content = content.replace(/{ name: "The Weeknd", emoji: "[^"]+" }/g, '{ name: "The Weeknd", image: "/collections/the_weeknd.png" }');
content = content.replace(/{ name: "Taylor Swift", emoji: "[^"]+" }/g, '{ name: "Taylor Swift", image: "/collections/taylor_swift.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Billie Eilish, BTS, Naruto, The Weeknd, and Taylor Swift themes updated!');

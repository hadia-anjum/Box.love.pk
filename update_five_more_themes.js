const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "One Piece", emoji: "[^"]+" }/g, '{ name: "One Piece", image: "/collections/one_piece.jpg" }');
content = content.replace(/{ name: "Jujutsu Kaisen", emoji: "[^"]+" }/g, '{ name: "Jujutsu Kaisen", image: "/collections/jujutsu_kaisen.jpg" }');
content = content.replace(/{ name: "My Melody", emoji: "[^"]+" }/g, '{ name: "My Melody", image: "/collections/my_melody.png" }');
content = content.replace(/{ name: "Barcelona", emoji: "[^"]+" }/g, '{ name: "Barcelona", image: "/collections/barcelona.png" }');
content = content.replace(/{ name: "Hello Kitty", emoji: "[^"]+" }/g, '{ name: "Hello Kitty", image: "/collections/hello_kitty.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('One Piece, Jujutsu Kaisen, My Melody, Barcelona, and Hello Kitty themes updated successfully!');

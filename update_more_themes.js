const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes
content = content.replace(/{ name: "Cinnamoroll", emoji: "[^"]+" }/g, '{ name: "Cinnamoroll", image: "/collections/cinnamoroll.jpg" }');
content = content.replace(/{ name: "Coquette", emoji: "[^"]+" }/g, '{ name: "Coquette", image: "/collections/coquette.jpg" }');
content = content.replace(/{ name: "Daisy", emoji: "[^"]+" }/g, '{ name: "Daisy", image: "/collections/daisy.jpg" }');
content = content.replace(/{ name: "Deadpool", emoji: "[^"]+" }/g, '{ name: "Deadpool", image: "/collections/deadpool.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);

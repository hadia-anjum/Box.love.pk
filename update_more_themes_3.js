const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update themes with new image paths
content = content.replace(/{ name: "GTA VI", emoji: "[^"]+" }/g, '{ name: "GTA VI", image: "/collections/gta_vi.png" }');
content = content.replace(/{ name: "Call of Duty", emoji: "[^"]+" }/g, '{ name: "Call of Duty", image: "/collections/call_of_duty.jpg" }');
content = content.replace(/{ name: "Ronaldo", emoji: "[^"]+" }/g, '{ name: "Ronaldo", image: "/collections/ronaldo.jpg" }');
content = content.replace(/{ name: "Cherry", emoji: "[^"]+" }/g, '{ name: "Cherry", image: "/collections/cherry.jpg" }');
content = content.replace(/{ name: "Lavender", emoji: "[^"]+" }/g, '{ name: "Lavender", image: "/collections/lavender.jpg" }');

fs.writeFileSync('src/app/page.tsx', content);
console.log('GTA VI, Call of Duty, Ronaldo, Cherry, and Lavender themes updated successfully!');

const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace z-50 with z-[100] in the lightbox backdrop
content = content.replace(
  'className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-[modalFadeIn_0.2s_ease-out_forwards]"',
  'className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none animate-[modalFadeIn_0.2s_ease-out_forwards]"'
);

fs.writeFileSync('src/app/page.tsx', content);
console.log('z-index updated successfully to z-[100]!');

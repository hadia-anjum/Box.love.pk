const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Replace the collections categories grid on the homepage (removing emojis and adding text animations)
const oldCategoriesGrid = `        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVarietiesModalOpen(true);
              }}
              className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10 transition-all group"
            >
              <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="font-bold text-[var(--dark-2)] text-sm sm:text-base">{cat.name}</span>
            </button>
          ))}
        </div>`;

const newCategoriesGrid = `        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVarietiesModalOpen(true);
              }}
              className="relative overflow-hidden bg-white border border-pink-100/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center min-h-[140px] hover:border-[var(--pink-400)] hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 to-pink-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative font-playfair font-extrabold text-[var(--dark-2)] text-sm sm:text-lg text-center group-hover:text-[var(--pink-600)] group-hover:scale-105 transition-all duration-300">
                {cat.name}
              </span>
              <span className="absolute bottom-4 w-6 h-1 bg-[var(--pink-400)] rounded-full transition-all duration-300 group-hover:w-16" />
            </button>
          ))}
        </div>`;

// 2. Replace the mockup image container in the Details step to support click/tap to zoom
const oldMockupArea = `                {/* Theme Image Mockup area */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl border border-pink-100 flex items-center justify-center overflow-hidden shadow-inner group">
                  {selectedTheme.image ? (
                    <Image
                      src={selectedTheme.image}
                      alt={selectedTheme.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (`;

const newMockupArea = `                {/* Theme Image Mockup area */}
                <div 
                  onClick={() => {
                    if (selectedTheme.image) {
                      setActiveReviewImg(selectedTheme.image);
                    }
                  }}
                  className={\`relative aspect-[4/3] bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl border border-pink-100 flex items-center justify-center overflow-hidden shadow-inner group \${selectedTheme.image ? 'cursor-zoom-in' : ''}\`}
                >
                  {selectedTheme.image ? (
                    <>
                      <Image
                        src={selectedTheme.image}
                        alt={selectedTheme.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Zoom Overlay Indicator */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-bold tracking-widest uppercase py-2 px-4 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          🔍 Tap to Zoom
                        </div>
                      </div>
                    </>
                  ) : (`;

// Normalize content and make replacements
const contentNormalized = content.replace(/\r\n/g, '\n');
const oldGridNorm = oldCategoriesGrid.replace(/\r\n/g, '\n');
const newGridNorm = newCategoriesGrid.replace(/\r\n/g, '\n');
const oldMockupNorm = oldMockupArea.replace(/\r\n/g, '\n');
const newMockupNorm = newMockupArea.replace(/\r\n/g, '\n');

if (contentNormalized.includes(oldGridNorm) && contentNormalized.includes(oldMockupNorm)) {
  let updated = contentNormalized.replace(oldGridNorm, newGridNorm);
  updated = updated.replace(oldMockupNorm, newMockupNorm);
  fs.writeFileSync('src/app/page.tsx', updated);
  console.log('REPLACEMENT SUCCESSFUL!');
} else {
  if (!contentNormalized.includes(oldGridNorm)) {
    console.log('GRID SECTION NOT FOUND!');
  }
  if (!contentNormalized.includes(oldMockupNorm)) {
    console.log('MOCKUP AREA SECTION NOT FOUND!');
  }
}

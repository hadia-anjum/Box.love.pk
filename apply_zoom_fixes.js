const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove "Tap to Zoom" indicator overlay from mockup image area in Details step
const oldMockupArea = `                {/* Theme Image Mockup area */}
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

const newMockupArea = `                {/* Theme Image Mockup area */}
                <div 
                  onClick={() => {
                    if (selectedTheme.image) {
                      setActiveReviewImg(selectedTheme.image);
                    }
                  }}
                  className={\`relative aspect-[4/3] bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl border border-pink-100 flex items-center justify-center overflow-hidden shadow-inner group \${selectedTheme.image ? 'cursor-zoom-in hover:brightness-95' : ''}\`}
                >
                  {selectedTheme.image ? (
                    <Image
                      src={selectedTheme.image}
                      alt={selectedTheme.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (`;

// 2. Make the Selected Theme image (80x80) in the Add-ons step clickable to zoom
const oldSummaryImage = `                {/* Selected Theme Card */}
                <div className="bg-gradient-to-br from-[var(--pink-50)] via-white to-[var(--pink-100)] rounded-2xl p-6 text-center border border-pink-100/60">
                  {selectedTheme.image ? (
                    <Image src={selectedTheme.image} alt={selectedTheme.name} width={80} height={80} className="mx-auto rounded-xl object-cover mb-3 shadow-md" />
                  ) : (`;

const newSummaryImage = `                {/* Selected Theme Card */}
                <div className="bg-gradient-to-br from-[var(--pink-50)] via-white to-[var(--pink-100)] rounded-2xl p-6 text-center border border-pink-100/60">
                  {selectedTheme.image ? (
                    <Image 
                      src={selectedTheme.image} 
                      alt={selectedTheme.name} 
                      width={80} 
                      height={80} 
                      className="mx-auto rounded-xl object-cover mb-3 shadow-md cursor-zoom-in hover:scale-105 transition-all duration-300" 
                      onClick={() => setActiveReviewImg(selectedTheme.image)}
                    />
                  ) : (`;

// 3. Make the Mini Summary image (40x40) in the Checkout Form step clickable to zoom
const oldMiniSummaryImage = `                {/* Mini summary */}
                <div className="flex items-center gap-4 bg-pink-50/40 border border-pink-100 rounded-2xl p-4">
                  {selectedTheme.image ? (
                    <Image src={selectedTheme.image} alt={selectedTheme.name} width={40} height={40} className="rounded-lg object-cover shadow-sm" />
                  ) : (`;

const newMiniSummaryImage = `                {/* Mini summary */}
                <div className="flex items-center gap-4 bg-pink-50/40 border border-pink-100 rounded-2xl p-4">
                  {selectedTheme.image ? (
                    <Image 
                      src={selectedTheme.image} 
                      alt={selectedTheme.name} 
                      width={40} 
                      height={40} 
                      className="rounded-lg object-cover shadow-sm cursor-zoom-in hover:scale-105 transition-all duration-300" 
                      onClick={() => setActiveReviewImg(selectedTheme.image)}
                    />
                  ) : (`;

// Normalize content and make replacements
const contentNormalized = content.replace(/\r\n/g, '\n');
const oldMockupNorm = oldMockupArea.replace(/\r\n/g, '\n');
const newMockupNorm = newMockupArea.replace(/\r\n/g, '\n');
const oldSummaryNorm = oldSummaryImage.replace(/\r\n/g, '\n');
const newSummaryNorm = newSummaryImage.replace(/\r\n/g, '\n');
const oldMiniNorm = oldMiniSummaryImage.replace(/\r\n/g, '\n');
const newMiniNorm = newMiniSummaryImage.replace(/\r\n/g, '\n');

if (contentNormalized.includes(oldMockupNorm) && contentNormalized.includes(oldSummaryNorm) && contentNormalized.includes(oldMiniNorm)) {
  let updated = contentNormalized.replace(oldMockupNorm, newMockupNorm);
  updated = updated.replace(oldSummaryNorm, newSummaryNorm);
  updated = updated.replace(oldMiniNorm, newMiniNorm);
  fs.writeFileSync('src/app/page.tsx', updated);
  console.log('REPLACEMENT SUCCESSFUL!');
} else {
  if (!contentNormalized.includes(oldMockupNorm)) {
    console.log('MOCKUP AREA SECTION NOT FOUND!');
  }
  if (!contentNormalized.includes(oldSummaryNorm)) {
    console.log('SUMMARY IMAGE SECTION NOT FOUND!');
  }
  if (!contentNormalized.includes(oldMiniNorm)) {
    console.log('MINI SUMMARY IMAGE SECTION NOT FOUND!');
  }
}

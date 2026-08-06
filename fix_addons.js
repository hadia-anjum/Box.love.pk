const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Old fairy lights button
const oldFairy = `                    <button
                      type="button"
                      onClick={() => setCollAddons(prev => ({ ...prev, fairy: !prev.fairy }))}
                      className={\`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 text-left \${
                        collAddons.fairy
                          ? "border-[var(--pink-400)] bg-pink-50 shadow-md shadow-pink-500/10"
                          : "border-pink-100 bg-white hover:border-pink-200"
                      }\`}
                    >
                      <span className="text-2xl">✨</span>
                      <div className="flex-1">
                        <span className="text-xs font-bold block text-[var(--dark-2)]">Fairy Lights</span>
                        <span className="text-[10px] text-[var(--text-light)] font-semibold">Add sparkle inside the box</span>
                      </div>
                      <span className="text-xs font-extrabold text-[var(--pink-600)]">+Rs. {PRICES.fairy}</span>
                    </button>`;

const newFairy = `                    <button
                      type="button"
                      onClick={() => setCollAddons(prev => ({ ...prev, fairy: !prev.fairy }))}
                      className={\`flex items-center justify-between gap-2 p-3 rounded-xl border-2 transition-all duration-300 \${
                        collAddons.fairy
                          ? "border-[var(--pink-400)] bg-pink-50 shadow-md shadow-pink-500/10"
                          : "border-pink-100 bg-white hover:border-pink-200"
                      }\`}
                    >
                      <span className="text-xs font-bold text-[var(--dark-2)]">✨ Fairy Lights</span>
                      <span className="text-[11px] font-extrabold text-[var(--pink-600)]">+Rs. {PRICES.fairy}</span>
                    </button>`;

// Old ribbon button
const oldRibbon = `                    <button
                      type="button"
                      onClick={() => setCollAddons(prev => ({ ...prev, ribbon: !prev.ribbon }))}
                      className={\`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 text-left \${
                        collAddons.ribbon
                          ? "border-[var(--pink-400)] bg-pink-50 shadow-md shadow-pink-500/10"
                          : "border-pink-100 bg-white hover:border-pink-200"
                      }\`}
                    >
                      <span className="text-2xl">🎀</span>
                      <div className="flex-1">
                        <span className="text-xs font-bold block text-[var(--dark-2)]">Ribbon Bow</span>
                        <span className="text-[10px] text-[var(--text-light)] font-semibold">Premium gift wrapping</span>
                      </div>
                      <span className="text-xs font-extrabold text-[var(--pink-600)]">+Rs. {PRICES.ribbon}</span>
                    </button>`;

const newRibbon = `                    <button
                      type="button"
                      onClick={() => setCollAddons(prev => ({ ...prev, ribbon: !prev.ribbon }))}
                      className={\`flex items-center justify-between gap-2 p-3 rounded-xl border-2 transition-all duration-300 \${
                        collAddons.ribbon
                          ? "border-[var(--pink-400)] bg-pink-50 shadow-md shadow-pink-500/10"
                          : "border-pink-100 bg-white hover:border-pink-200"
                      }\`}
                    >
                      <span className="text-xs font-bold text-[var(--dark-2)]">🎀 Ribbon Bow</span>
                      <span className="text-[11px] font-extrabold text-[var(--pink-600)]">+Rs. {PRICES.ribbon}</span>
                    </button>`;

// Also change grid from 1 col to 2 col
content = content.replace('grid grid-cols-1 sm:grid-cols-2 gap-3', 'grid grid-cols-2 gap-3');

content = content.replace(oldFairy, newFairy);
content = content.replace(oldRibbon, newRibbon);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Add-ons simplified!');

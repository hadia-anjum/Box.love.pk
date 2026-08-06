const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update state definition
content = content.replace(
  'const [selectedTheme, setSelectedTheme] = useState<{name: string; emoji: string; category: string; price: number; id: string} | null>(null);',
  'const [selectedTheme, setSelectedTheme] = useState<{name: string; emoji?: string; image?: string; category: string; price: number; id: string} | null>(null);'
);

// Update themes
content = content.replace(/{ name: "Barbie", emoji: "[^"]+" }/g, '{ name: "Barbie", image: "/collections/barbie.jpg" }');
content = content.replace(/{ name: "Batman", emoji: "[^"]+" }/g, '{ name: "Batman", image: "/collections/batman.jpg" }');
content = content.replace(/{ name: "BMW M", emoji: "[^"]+" }/g, '{ name: "BMW M", image: "/collections/bmw.jpg" }');
content = content.replace(/{ name: "Bugatti", emoji: "[^"]+" }/g, '{ name: "Bugatti", image: "/collections/bugatti.jpg" }');
content = content.replace(/{ name: "Butterfly", emoji: "[^"]+" }/g, '{ name: "Butterfly", image: "/collections/butterfly.jpg" }');

// Update emoji fallback in details preview (Step 0)
const detailsEmojiOld = `<span className="text-7xl mb-2 animate-[floatIcon_3s_ease-in-out_infinite]">{selectedTheme.emoji}</span>
                    <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase bg-white/80 backdrop-blur-sm py-1 px-3.5 rounded-full border border-pink-100">
                      Photo Coming Soon 📸
                    </span>`;
const detailsEmojiNew = `{selectedTheme.image ? (
                      <Image src={selectedTheme.image} alt={selectedTheme.name} width={200} height={200} className="object-cover rounded-xl shadow-lg z-10 relative" />
                    ) : (
                      <>
                        <span className="text-7xl mb-2 animate-[floatIcon_3s_ease-in-out_infinite]">{selectedTheme.emoji}</span>
                        <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase bg-white/80 backdrop-blur-sm py-1 px-3.5 rounded-full border border-pink-100 z-10 relative">
                          Photo Coming Soon 📸
                        </span>
                      </>
                    )}`;
content = content.replace(detailsEmojiOld, detailsEmojiNew);

const summaryEmojiOld = `<span className="text-6xl block mb-3">{selectedTheme.emoji}</span>`;
const summaryEmojiNew = `{selectedTheme.image ? (
                    <Image src={selectedTheme.image} alt={selectedTheme.name} width={80} height={80} className="mx-auto rounded-xl object-cover mb-3 shadow-md" />
                  ) : (
                    <span className="text-6xl block mb-3">{selectedTheme.emoji}</span>
                  )}`;
content = content.replace(summaryEmojiOld, summaryEmojiNew);

const miniSummaryEmojiOld = `<span className="text-4xl">{selectedTheme.emoji}</span>`;
const miniSummaryEmojiNew = `{selectedTheme.image ? (
                    <Image src={selectedTheme.image} alt={selectedTheme.name} width={40} height={40} className="rounded-lg object-cover shadow-sm" />
                  ) : (
                    <span className="text-4xl">{selectedTheme.emoji}</span>
                  )}`;
content = content.replace(miniSummaryEmojiOld, miniSummaryEmojiNew);


// Append the collections section and varieties modal
const collectionsSection = `      {/* ========== COLLECTIONS SECTION ========== */}
      <section id="collections" className="py-12 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-20">
          <div className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-4">
            Curated For You
          </div>
          <h2 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[var(--dark-2)]">
            Our <span className="text-[var(--pink-500)]">Themed</span> Collections
          </h2>
          <p className="text-[var(--text-mid)] text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Beautifully crafted boxes for every occasion. Select a collection below to see the varieties!
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
        </div>
      </section>

      {/* ========== PAYMENT & GUIDE SECTION (REDESIGNED LUXURY CREDIT CARD CARD) ========== */}`;

content = content.replace(`      {/* ========== PAYMENT & GUIDE SECTION (REDESIGNED LUXURY CREDIT CARD CARD) ========== */}`, collectionsSection);

const varietiesModal = `      {/* ========== VARIETIES MODAL ========== */}
      {varietiesModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-[modalFadeIn_0.3s_ease-out_forwards]">
          <div className="bg-white rounded-[32px] max-w-4xl w-full shadow-2xl relative p-6 sm:p-10">
            <button
              onClick={() => setVarietiesModalOpen(false)}
              className="absolute top-5 right-5 text-stone-500 hover:text-stone-850 p-2 text-xl hover:bg-pink-50 rounded-xl transition-all"
            >
              ✕
            </button>
            <div className="text-center mb-8 border-b border-pink-100 pb-5">
              <span className="font-dancing text-3xl font-black text-[var(--pink-500)]">Select Theme</span>
              <h3 className="font-playfair text-2xl font-bold text-[var(--dark-2)] mt-2">
                {COLLECTIONS.find(c => c.id === selectedCategory)?.name}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {COLLECTIONS.find(c => c.id === selectedCategory)?.themes.map((theme, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const catName = COLLECTIONS.find(c => c.id === selectedCategory)?.name || "";
                    setSelectedTheme({ ...theme, category: catName, price: COLLECTION_PRICE, id: selectedCategory });
                    setVarietiesModalOpen(false);
                    setCollCheckoutStep("details");
                    setCollectionModalOpen(true);
                  }}
                  className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10 hover:bg-white hover:border-[var(--pink-300)] transition-all group overflow-hidden"
                >
                  {theme.image ? (
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden mb-2 shadow-sm shrink-0">
                      <Image src={theme.image} alt={theme.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ) : (
                    <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform mb-2">{theme.emoji}</span>
                  )}
                  <span className="font-bold text-xs sm:text-sm text-[var(--dark-2)] text-center line-clamp-2">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== COLLECTION CHECKOUT MODAL ========== */}`;

content = content.replace(`      {/* ========== COLLECTION CHECKOUT MODAL ========== */}`, varietiesModal);

fs.writeFileSync('src/app/page.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Find the broken section: from varieties modal grid closing through collection modal
// The varieties modal grid ends with theme buttons, then it should close properly
// and the collection modal should be separate

// Strategy: Find the varieties modal content and rebuild the ending + collection modal start

const brokenStart = `              </button>
              ))}
            </div>
                </div>\r\n\r\n                {/* Box details list */}`;

const fixedReplacement = `              </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== COLLECTION CHECKOUT MODAL ========== */}
      {collectionModalOpen && selectedTheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-[modalFadeIn_0.3s_ease-out_forwards]">
          <div className="bg-white rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-10 animate-[modalSlideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <button
              onClick={() => { setCollectionModalOpen(false); setCollCheckoutStep("details"); }}
              className="absolute top-5 right-5 text-stone-500 hover:text-stone-850 p-2.5 text-xl focus:outline-none hover:bg-pink-50 rounded-xl transition-all"
              aria-label="Close modal"
            >
              ✕
            </button>

            {collCheckoutStep === "details" ? (
              /* --- Step 0: Theme Details View --- */
              <div className="space-y-6">
                <div className="text-center border-b border-pink-100 pb-5">
                  <span className="font-dancing text-3xl font-black text-[var(--pink-500)]">
                    box.love.pk
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[var(--dark-2)] mt-1">
                    Theme Details
                  </h3>
                </div>

                {/* Theme Image Mockup area */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-50 via-white to-pink-100 rounded-2xl border border-pink-100 flex items-center justify-center overflow-hidden shadow-inner group">
                  {selectedTheme.image ? (
                    <Image
                      src={selectedTheme.image}
                      alt={selectedTheme.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <span className="text-7xl mb-2 animate-[floatIcon_3s_ease-in-out_infinite]">{selectedTheme.emoji}</span>
                      <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase bg-white/80 backdrop-blur-sm py-1 px-3.5 rounded-full border border-pink-100">
                        Photo Coming Soon 📸
                      </span>
                    </div>
                  )}
                </div>

                {/* Text detailing */}
                <div className="space-y-2">
                  <span className="inline-block bg-[var(--pink-50)] text-[var(--pink-600)] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {selectedTheme.category}
                  </span>
                  <h4 className="font-playfair text-2xl font-black text-[var(--dark-2)]">
                    {selectedTheme.name} Gift Box
                  </h4>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-extrabold text-2xl text-[var(--pink-600)]">Rs. {COLLECTION_PRICE.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-[var(--text-light)] bg-pink-50 px-3 py-1 rounded-full">
                      + Rs. {COLLECTION_DELIVERY} delivery
                    </span>
                  </div>
                </div>

                {/* Box details list */}`;

content = content.replace(brokenStart, fixedReplacement);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Fix applied successfully!');

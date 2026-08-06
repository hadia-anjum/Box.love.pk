const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetSection = `                {/* Optional Add-ons */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    ✨ Optional Add-ons
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
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
                    </button>
                    <button
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
                    </button>
                  </div>
                </div>`;

const replacementSection = `                {/* Optional Add-ons */}
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[var(--text-mid)]">
                    ✨ Optional Add-ons
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Fairy Lights Card */}
                    <button
                      type="button"
                      onClick={() => setCollAddons((prev) => ({ ...prev, fairy: !prev.fairy }))}
                      className={\`flex items-center gap-3 border-2 text-left rounded-2xl p-4 cursor-pointer transition-all duration-300 focus:outline-none \${
                        collAddons.fairy
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]/35 shadow-md"
                          : "border-pink-100 bg-white hover:border-pink-300 hover:shadow-md"
                      }\`}
                    >
                      <div
                        className={\`w-5 h-5 rounded-lg border flex items-center justify-center text-[10px] text-white shrink-0 transition-all \${
                          collAddons.fairy
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }\`}
                      >
                        {collAddons.fairy && "✓"}
                      </div>
                      <div className="grow">
                        <strong className="block text-xs text-[var(--dark-2)]">
                          Fairy Lights
                        </strong>
                      </div>
                      <div className="font-extrabold text-[var(--pink-600)] text-xs shrink-0">
                        + Rs. {PRICES.fairy}
                      </div>
                    </button>

                    {/* Ribbon Bow Card */}
                    <button
                      type="button"
                      onClick={() => setCollAddons((prev) => ({ ...prev, ribbon: !prev.ribbon }))}
                      className={\`flex items-center gap-3 border-2 text-left rounded-2xl p-4 cursor-pointer transition-all duration-300 focus:outline-none \${
                        collAddons.ribbon
                          ? "border-[var(--pink-500)] bg-[var(--pink-50)]/30 ring-1 ring-[var(--pink-300)]/35 shadow-md"
                          : "border-pink-100 bg-white hover:border-pink-300 hover:shadow-md"
                      }\`}
                    >
                      <div
                        className={\`w-5 h-5 rounded-lg border flex items-center justify-center text-[10px] text-white shrink-0 transition-all \${
                          collAddons.ribbon
                            ? "bg-[var(--pink-500)] border-[var(--pink-500)]"
                            : "border-pink-200 bg-white"
                        }\`}
                      >
                        {collAddons.ribbon && "✓"}
                      </div>
                      <div className="grow">
                        <strong className="block text-xs text-[var(--dark-2)]">
                          Ribbon Bow
                        </strong>
                      </div>
                      <div className="font-extrabold text-[var(--pink-600)] text-xs shrink-0">
                        + Rs. {PRICES.ribbon}
                      </div>
                    </button>
                  </div>
                </div>`;

if (content.includes(targetSection)) {
  content = content.replace(targetSection, replacementSection);
  fs.writeFileSync('src/app/page.tsx', content);
  console.log('REPLACEMENT SUCCESSFUL!');
} else {
  // Let's try replacing with normalizing line endings
  const contentNormalized = content.replace(/\r\n/g, '\n');
  const targetNormalized = targetSection.replace(/\r\n/g, '\n');
  const replacementNormalized = replacementSection.replace(/\r\n/g, '\n');
  if (contentNormalized.includes(targetNormalized)) {
    const fixedContent = contentNormalized.replace(targetNormalized, replacementNormalized);
    fs.writeFileSync('src/app/page.tsx', fixedContent);
    console.log('REPLACEMENT SUCCESSFUL (normalized)!');
  } else {
    console.log('TARGET SECTION NOT FOUND!');
  }
}

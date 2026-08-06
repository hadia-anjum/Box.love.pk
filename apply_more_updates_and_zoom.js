const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Insert local state variables for zoomable lightbox
const oldStateLine = '  const [activeReviewImg, setActiveReviewImg] = useState<string | null>(null);';
const newStateLine = `  const [activeReviewImg, setActiveReviewImg] = useState<string | null>(null);
  const [lightboxScale, setLightboxScale] = useState<number>(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isDraggingLightbox, setIsDraggingLightbox] = useState(false);
  const [dragStartLightbox, setDragStartLightbox] = useState({ x: 0, y: 0 });`;

content = content.replace(oldStateLine, newStateLine);

// 2. Map theme images in COLLECTIONS array
// Gaming Collection: Minecraft
content = content.replace(/{ name: "Minecraft", emoji: "[^"]+" }/g, '{ name: "Minecraft", image: "/collections/minecraft.png" }');

// Cars Collection: Ferrari, Formula 1
content = content.replace(/{ name: "Ferrari", emoji: "[^"]+" }/g, '{ name: "Ferrari", image: "/collections/ferrari.jpg" }');
content = content.replace(/{ name: "Formula 1", emoji: "[^"]+" }/g, '{ name: "Charles Leclerc / F1", image: "/collections/charles_leclerc.jpg" }');

// 3. Rewrite Lightbox modal component at the bottom of the page
const oldLightboxBlock = `      {/* ========== IMAGE LIGHTBOX MODAL ========== */}
      {activeReviewImg && (
        <div
          onClick={() => setActiveReviewImg(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-[modalFadeIn_0.2s_ease-out_forwards]"
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] flex items-center justify-center animate-[modalSlideUp_0.25s_ease-out_forwards]">
            <button
              onClick={() => setActiveReviewImg(null)}
              className="absolute top-[-40px] right-0 text-white hover:text-pink-200 text-sm font-black focus:outline-none p-2 bg-black/40 px-4 py-1.5 rounded-full"
              aria-label="Close image"
            >
              ✕ Close
            </button>
            <div className="relative w-full h-[70vh] sm:h-[80vh]">
              <Image
                src={activeReviewImg}
                alt="Enlarged box preview"
                fill
                className="object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}`;

const newLightboxBlock = `      {/* ========== IMAGE LIGHTBOX MODAL ========== */}
      {activeReviewImg && (
        <div
          onClick={() => {
            setActiveReviewImg(null);
            setLightboxScale(1);
            setLightboxPosition({ x: 0, y: 0 });
          }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-[modalFadeIn_0.2s_ease-out_forwards]"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full h-[80vh] flex flex-col items-center justify-center"
          >
            {/* Top Bar Controls */}
            <div className="absolute top-[-50px] right-0 left-0 flex justify-between items-center z-10 px-2">
              <div className="flex gap-2 bg-black/40 rounded-full px-4 py-1.5 backdrop-blur-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxScale(prev => Math.max(1, prev - 0.5));
                    if (lightboxScale <= 1.5) setLightboxPosition({ x: 0, y: 0 });
                  }}
                  disabled={lightboxScale <= 1}
                  className="text-white hover:text-pink-200 text-sm font-black disabled:opacity-40 disabled:hover:text-white px-2 focus:outline-none cursor-pointer"
                  title="Zoom Out"
                >
                  ➖
                </button>
                <span className="text-white text-xs font-bold min-w-[50px] text-center">
                  {Math.round(lightboxScale * 100)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxScale(prev => Math.min(3, prev + 0.5));
                  }}
                  disabled={lightboxScale >= 3}
                  className="text-white hover:text-pink-200 text-sm font-black disabled:opacity-40 disabled:hover:text-white px-2 focus:outline-none cursor-pointer"
                  title="Zoom In"
                >
                  ➕
                </button>
                {lightboxScale > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxScale(1);
                      setLightboxPosition({ x: 0, y: 0 });
                    }}
                    className="text-pink-300 hover:text-pink-100 text-xs font-extrabold ml-2 border-l border-white/20 pl-2.5 focus:outline-none cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setActiveReviewImg(null);
                  setLightboxScale(1);
                  setLightboxPosition({ x: 0, y: 0 });
                }}
                className="text-white hover:text-pink-200 text-sm font-black focus:outline-none bg-black/40 hover:bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm cursor-pointer"
                aria-label="Close image"
              >
                ✕ Close
              </button>
            </div>

            {/* Image Container with Zoom & Pan */}
            <div 
              className="relative w-full h-full overflow-hidden flex items-center justify-center rounded-2xl"
              onMouseDown={(e) => {
                if (lightboxScale > 1) {
                  setIsDraggingLightbox(true);
                  setDragStartLightbox({ x: e.clientX - lightboxPosition.x, y: e.clientY - lightboxPosition.y });
                }
              }}
              onMouseMove={(e) => {
                if (isDraggingLightbox && lightboxScale > 1) {
                  setLightboxPosition({ x: e.clientX - dragStartLightbox.x, y: e.clientY - dragStartLightbox.y });
                }
              }}
              onMouseUp={() => setIsDraggingLightbox(false)}
              onMouseLeave={() => setIsDraggingLightbox(false)}
              onTouchStart={(e) => {
                if (lightboxScale > 1 && e.touches.length === 1) {
                  setIsDraggingLightbox(true);
                  setDragStartLightbox({ x: e.touches[0].clientX - lightboxPosition.x, y: e.touches[0].clientY - lightboxPosition.y });
                }
              }}
              onTouchMove={(e) => {
                if (isDraggingLightbox && lightboxScale > 1 && e.touches.length === 1) {
                  setLightboxPosition({ x: e.touches[0].clientX - dragStartLightbox.x, y: e.touches[0].clientY - dragStartLightbox.y });
                }
              }}
              onTouchEnd={() => setIsDraggingLightbox(false)}
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (lightboxScale > 1) {
                    setLightboxScale(1);
                    setLightboxPosition({ x: 0, y: 0 });
                  } else {
                    setLightboxScale(2);
                  }
                }}
                className="relative w-full h-full transition-transform duration-300 ease-out select-none"
                style={{
                  transform: \`scale(\${lightboxScale}) translate(\${lightboxPosition.x / lightboxScale}px, \${lightboxPosition.y / lightboxScale}px)\`,
                  cursor: lightboxScale > 1 ? (isDraggingLightbox ? 'grabbing' : 'grab') : 'zoom-in',
                  transformOrigin: 'center center'
                }}
              >
                <Image
                  src={activeReviewImg}
                  alt="Enlarged box preview"
                  fill
                  className="object-contain rounded-2xl pointer-events-none"
                  priority
                />
              </div>
            </div>
            {/* Small helper hint at the bottom */}
            <div className="absolute bottom-[-35px] text-white/50 text-[10px] font-medium tracking-wide">
              {lightboxScale > 1 ? "Drag to pan • Click / tap to zoom out" : "Click / tap image to zoom in"}
            </div>
          </div>
        </div>
      )}`;

// Normalize content and make replacements
const contentNormalized = content.replace(/\r\n/g, '\n');
const oldLightboxNorm = oldLightboxBlock.replace(/\r\n/g, '\n');
const newLightboxNorm = newLightboxBlock.replace(/\r\n/g, '\n');

if (contentNormalized.includes(oldStateLine) && contentNormalized.includes(oldLightboxNorm)) {
  let updated = contentNormalized.replace(oldStateLine, newStateLine);
  updated = updated.replace(oldLightboxNorm, newLightboxNorm);
  fs.writeFileSync('src/app/page.tsx', updated);
  console.log('REPLACEMENT SUCCESSFUL!');
} else {
  if (!contentNormalized.includes(oldStateLine)) {
    console.log('STATE LINE NOT FOUND!');
  }
  if (!contentNormalized.includes(oldLightboxNorm)) {
    console.log('LIGHTBOX BLOCK NOT FOUND!');
  }
}

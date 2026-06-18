/* =====================================================
   STATE
===================================================== */
const state = {
  orderType: 'custom', // 'simple' | 'custom'
  top:    false,
  inside: false,
  inkColor: 'gold', // 'gold' | 'silver'
  addons: { fairy: false, ribbon: false }
};

const PRICES = {
  box: 1600, top: 300, inside: 300,
  fairy: 300, ribbon: 100, delivery: 400
};


/* =====================================================
   PARTICLES
===================================================== */
(function() {
  const c = document.getElementById('particles');
  const cols = ['rgba(232,145,191,0.4)','rgba(194,51,106,0.3)','rgba(244,186,218,0.5)','rgba(212,168,83,0.2)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = 4 + Math.random() * 10;
    p.style.cssText = `width:${s}px;height:${s}px;background:${cols[i%cols.length]};left:${Math.random()*100}%;--dur:${8+Math.random()*12}s;--delay:${Math.random()*10}s;`;
    c.appendChild(p);
  }
})();

/* =====================================================
   FAIRY LIGHTS STRIP
===================================================== */
(function() {
  const strip = document.getElementById('lightsStrip');
  if (!strip) return;
  const bulbColors = ['#FF6B8A','#FFD700','#98E4FF','#A0FF98','#FFB3D9','#FFCF77','#B0A0FF'];
  let html = '<div class="lights-row">';
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 60; i++) {
      const c = bulbColors[i % bulbColors.length];
      const dur = (1.5 + Math.random()*2).toFixed(1);
      const del = (Math.random()*3).toFixed(1);
      html += `<div class="bulb"><div class="bulb-body" style="background:${c};--b-dur:${dur}s;--b-delay:${del}s;box-shadow:0 0 8px ${c};"></div><div class="bulb-base"></div></div>`;
    }
  }
  html += '</div>';
  strip.innerHTML = html;
})();

/* =====================================================
   NAV SCROLL
===================================================== */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 50);
});

/* =====================================================
   SCROLL REVEAL
===================================================== */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* =====================================================
   HERO BOX PARALLAX
===================================================== */
const heroBox = document.getElementById('heroBox');
const heroSec = document.querySelector('.hero');
if (heroSec && heroBox) {
  heroSec.addEventListener('mousemove', e => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  / r.width;
    const dy = (e.clientY - r.top  - r.height/2) / r.height;
    heroBox.style.transform = `rotateX(${18 - dy*15}deg) rotateY(${-28 + dx*20}deg)`;
    heroBox.style.animationPlayState = 'paused';
  });
  heroSec.addEventListener('mouseleave', () => {
    heroBox.style.transform = '';
    heroBox.style.animationPlayState = 'running';
  });
}

/* =====================================================
   ORDER TYPE: Simple vs Custom
===================================================== */
function selectOrderType(type) {
  state.orderType = type;

  document.querySelectorAll('.order-type-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('ot-' + type).classList.add('selected');

  const customSteps = document.getElementById('customSteps');
  const simpleInfo  = document.getElementById('simpleInfo');
  const previewWrap = document.getElementById('previewWrap');

  if (type === 'simple') {
    customSteps.style.display = 'none';
    simpleInfo.style.display  = 'block';
    previewWrap.innerHTML = `
      <div class="simple-box-preview">
        <span class="simple-box-icon">🖤</span>
        <div class="simple-box-note">A beautiful plain black box —<br>clean, elegant &amp; ready to fill with love ✨</div>
      </div>`;
  } else {
    customSteps.style.display = 'block';
    simpleInfo.style.display  = 'none';
    renderPreviewTabs();
    liveUpdate();
  }
  updateCart();
}

/* =====================================================
   INK COLOR
===================================================== */
function setInkColor(color) {
  state.inkColor = color;
  liveUpdate();
}

/* =====================================================
   TAB SWITCHER: TOP / INSIDE
===================================================== */
function switchTab(tab) {
  const topPane    = document.getElementById('topPane');
  const insidePane = document.getElementById('insidePane');
  const tabTop     = document.getElementById('tabTop');
  const tabInside  = document.getElementById('tabInside');
  if (!topPane) return;

  if (tab === 'top') {
    topPane.style.display = 'block';
    insidePane.classList.remove('visible');
    tabTop.classList.add('active');
    tabInside.classList.remove('active');
  } else {
    if (!state.inside) {
      const cb = document.getElementById('cb-inside');
      if (cb) { cb.style.animation = 'shake 0.4s ease'; setTimeout(() => cb.style.animation = '', 500); }
      return;
    }
    topPane.style.display = 'none';
    insidePane.classList.add('visible');
    tabTop.classList.remove('active');
    tabInside.classList.add('active');
  }
}

function renderPreviewTabs() {
  const pw = document.getElementById('previewWrap');
  if (!pw) return;
  pw.innerHTML = `
    <div class="preview-tabs">
      <button class="preview-tab active" id="tabTop" onclick="switchTab('top')">Box Top</button>
      <button class="preview-tab" id="tabInside" onclick="switchTab('inside')" style="opacity:0.35;">Inside</button>
    </div>
    <div id="topPane" class="box-mockup-wrap">
      <div class="box-face-flat" id="boxTopFace" style="background: radial-gradient(ellipse at 40% 35%, #222222 0%, #121212 70%, #080808 100%) !important; box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.15) !important;">
        <div class="face-label" style="background: rgba(255,255,255,0.15) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.7) !important;">Top of Box</div>
        <div class="box-text-layer">
          <span class="live-gold-text placeholder-gold" id="liveTopText">Enable writing above and<br>type your message… it will appear<br>in golden ink ✨</span>
        </div>
      </div>
    </div>
    <div id="insidePane" class="box-mockup-wrap">
      <div class="box-face-flat box-face-inside" id="boxInsideFace" style="background: radial-gradient(ellipse at 50% 40%, #1e1e1e 0%, #101010 70%, #060606 100%) !important; box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.6) !important;">
        <div class="face-label" style="background: rgba(255,255,255,0.15) !important; border: 1px solid rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.7) !important;">Inside of Box</div>
        <div class="box-text-layer">
          <span class="live-gold-text placeholder-gold" id="liveInsideText">Enable "Write Inside" above<br>and type your message 💕</span>
        </div>
      </div>
    </div>`;
}

/* =====================================================
   SAVE MESSAGE BUTTON
===================================================== */
function saveMsg(type) {
  const ta  = document.getElementById('ta-' + type);
  const btn = document.getElementById('save-btn-' + type);
  if (!ta || !ta.value.trim()) return;

  // Save to localStorage
  localStorage.setItem('saved_' + type, ta.value);

  // Visual feedback
  btn.classList.add('saved');
  btn.innerHTML = '✅ Saved!';
  setTimeout(() => {
    btn.classList.remove('saved');
    btn.innerHTML = '💾 Save';
  }, 2000);
}

/* =====================================================
   LIVE UPDATE — flat realistic box preview
===================================================== */
function liveUpdate() {
  if (state.orderType === 'simple') { updateCart(); return; }

  const topTA    = document.getElementById('ta-top');
  const insideTA = document.getElementById('ta-inside');
  const topText    = topTA    ? topTA.value    : '';
  const insideText = insideTA ? insideTA.value : '';

  // Character counts
  const ccTop    = document.getElementById('cc-top');
  const ccInside = document.getElementById('cc-inside');
  if (ccTop)    ccTop.textContent    = topText.length;
  if (ccInside) ccInside.textContent = insideText.length;

  // Ink class
  const inkClass = state.inkColor === 'silver' ? 'silver-ink' : 'gold-ink';
  const textCol = state.inkColor === 'silver' ? '#E0EAF5' : '#F0C97A';
  const textShad = state.inkColor === 'silver' 
    ? '0 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(224, 234, 245, 0.4)' 
    : '0 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(240, 201, 122, 0.5)';

  // ---- TOP face ----
  const topEl = document.getElementById('liveTopText');
  if (topEl) {
    if (state.top && topText.trim()) {
      topEl.className = 'live-gold-text ' + inkClass;
      topEl.style.color = textCol;
      topEl.style.textShadow = textShad;
      topEl.innerHTML = topText.replace(/\n/g, '<br>');
      const len = topText.length;
      topEl.style.fontSize = len < 25 ? '2.2rem' : len < 55 ? '1.7rem' : len < 100 ? '1.3rem' : '1.05rem';
    } else {
      topEl.className = 'live-gold-text placeholder-gold';
      topEl.style.color = 'rgba(255, 255, 255, 0.3)';
      topEl.style.textShadow = 'none';
      topEl.style.fontSize = '';
      topEl.innerHTML = state.top
        ? 'Start typing your message…<br>it will appear here in ' + (state.inkColor === 'silver' ? 'silver' : 'golden') + ' ink ✨'
        : 'Enable "Write on Top" above to<br>preview your message here ✨';
    }
  }

  // ---- INSIDE face ----
  const insideEl = document.getElementById('liveInsideText');
  const tabInside = document.getElementById('tabInside');
  if (insideEl) {
    if (state.inside) {
      if (tabInside) tabInside.style.opacity = '1';
      if (insideText.trim()) {
        insideEl.className = 'live-gold-text ' + inkClass;
        insideEl.style.color = textCol;
        insideEl.style.textShadow = textShad;
        insideEl.innerHTML = insideText.replace(/\n/g, '<br>');
        const len2 = insideText.length;
        insideEl.style.fontSize = len2 < 25 ? '2.2rem' : len2 < 80 ? '1.7rem' : len2 < 160 ? '1.3rem' : '1.05rem';
      } else {
        insideEl.className = 'live-gold-text placeholder-gold';
        insideEl.style.color = 'rgba(255, 255, 255, 0.3)';
        insideEl.style.textShadow = 'none';
        insideEl.style.fontSize = '';
        insideEl.innerHTML = 'Type your inside message above 💕';
      }
      // Auto-switch to inside tab while typing inside
      if (insideText.length > 0 && document.activeElement === insideTA) switchTab('inside');
    } else {
      if (tabInside) tabInside.style.opacity = '0.35';
      insideEl.className = 'live-gold-text placeholder-gold';
      insideEl.style.color = 'rgba(255, 255, 255, 0.3)';
      insideEl.style.textShadow = 'none';
      insideEl.style.fontSize = '';
      insideEl.innerHTML = 'Enable "Write Inside" above<br>and type your message 💕';
      switchTab('top');
    }
  }

  // ---- Hero box lid text ----
  const heroEl = document.getElementById('heroLidText');
  if (heroEl) {
    if (state.top && topText.trim()) {
      heroEl.innerHTML = topText.replace(/\n/g, '<br>');
    } else {
      heroEl.innerHTML = '"You aren\'t just my universe,<br>you\'re the gravity<br>that holds it all together"';
    }
  }

  updateCart();
}

/* =====================================================
   TOGGLE MSG (TOP / INSIDE)
===================================================== */
function toggleMsg(type) {
  state[type] = !state[type];
  const cb = document.getElementById('cb-' + type);
  const ta = document.getElementById('ta-' + type);
  const saveBtn = document.getElementById('save-btn-' + type);

  if (state[type]) {
    cb.classList.add('checked');
    if (ta) ta.disabled = false;
    if (saveBtn) saveBtn.style.display = 'inline-flex';
    if (type === 'inside') switchTab('inside');
  } else {
    cb.classList.remove('checked');
    if (ta) ta.disabled = true;
    if (saveBtn) saveBtn.style.display = 'none';
    if (type === 'inside') switchTab('top');
  }
  liveUpdate();
}

/* =====================================================
   TOGGLE ADD-ON
===================================================== */
function toggleAddon(id) {
  state.addons[id] = !state.addons[id];
  const card = document.getElementById('ac-'   + id);
  const chk  = document.getElementById('achk-' + id);
  if (state.addons[id]) {
    card.classList.add('active');
    chk.style.background  = 'linear-gradient(135deg,#C2336A,#9B2452)';
    chk.style.borderColor = '#C2336A';
    chk.innerHTML = '<span style="color:white;font-size:0.8rem;font-weight:700;">✓</span>';
  } else {
    card.classList.remove('active');
    chk.style.background  = '';
    chk.style.borderColor = '';
    chk.innerHTML = '';
  }
  updateCart();
}

/* =====================================================
   UPDATE CART TOTALS
===================================================== */
function updateCart() {
  let total     = PRICES.box + PRICES.delivery;
  let itemCount = 1;

  if (state.orderType === 'simple') {
    document.getElementById('cr-top').style.display    = 'none';
    document.getElementById('cr-inside').style.display = 'none';
    document.getElementById('cr-fairy').style.display  = 'none';
    document.getElementById('cr-ribbon').style.display = 'none';
  } else {
    // top writing
    document.getElementById('cr-top').style.display = state.top ? 'flex' : 'none';
    if (state.top)    { total += PRICES.top;    itemCount++; }
    // inside writing
    document.getElementById('cr-inside').style.display = state.inside ? 'flex' : 'none';
    if (state.inside) { total += PRICES.inside; itemCount++; }
    // addons
    Object.keys(state.addons).forEach(k => {
      document.getElementById('cr-' + k).style.display = state.addons[k] ? 'flex' : 'none';
      if (state.addons[k]) { total += PRICES[k]; itemCount++; }
    });
  }

  document.getElementById('cartTotal').textContent  = 'Rs. ' + total.toLocaleString();
  document.getElementById('cartCount').textContent  = itemCount;
}

/* =====================================================
   MODAL & CHECKOUT FLOW
===================================================== */
function openModal() {
  const topText    = (document.getElementById('ta-top')    || {value:''}).value;
  const insideText = (document.getElementById('ta-inside') || {value:''}).value;
  let total = PRICES.box + PRICES.delivery;
  let rows  = '';

  rows += `<div class="order-row"><span class="or-key">Black Luxury Box</span><span class="or-val">Rs. 1,600</span></div>`;

  if (state.orderType === 'simple') {
    rows += `<div class="order-row"><span class="or-key">Type</span><span class="or-val">Simple Black Box</span></div>`;
  } else {
    if (state.top) {
      rows += `<div class="order-row"><span class="or-key">Top Message</span><span class="or-val">${topText || '(not written yet)'}</span></div>`;
      total += PRICES.top;
    }
    if (state.inside) {
      rows += `<div class="order-row"><span class="or-key">Inside Message</span><span class="or-val">${insideText || '(not written yet)'}</span></div>`;
      total += PRICES.inside;
    }
    if (state.top || state.inside) {
      rows += `<div class="order-row"><span class="or-key">Ink Colour</span><span class="or-val">${state.inkColor === 'silver' ? 'Silver' : 'Golden'}</span></div>`;
    }
    if (state.addons.fairy)  { rows += `<div class="order-row"><span class="or-key">Fairy Lights</span><span class="or-val">Rs. 300</span></div>`;  total += PRICES.fairy; }
    if (state.addons.ribbon) { rows += `<div class="order-row"><span class="or-key">Ribbon Bow</span><span class="or-val">Rs. 100</span></div>`;   total += PRICES.ribbon; }
  }
  rows += `<div class="order-row"><span class="or-key">Delivery</span><span class="or-val">Rs. 400</span></div>`;

  document.getElementById('modalRows').innerHTML       = rows;
  
  const formattedTotal = 'Rs. ' + total.toLocaleString();
  document.getElementById('modalTotalVal').textContent = formattedTotal;
  document.getElementById('summaryBarTotal').textContent = formattedTotal;
  
  // Highlight amount in final view
  const modalAmt = document.getElementById('modalAmountHighlight');
  if (modalAmt) modalAmt.textContent = formattedTotal;

  // Restore checkout info from localStorage if present
  loadCheckoutInfo();

  // Reset to checkout step
  document.getElementById('checkoutFormView').style.display = 'block';
  document.getElementById('paymentInstructionsView').style.display = 'none';
  
  // Reset collapsible summary
  const summaryDetails = document.getElementById('checkoutSummaryDetails');
  summaryDetails.classList.add('collapsed');
  const toggleBtn = document.querySelector('.summary-toggle-text');
  if (toggleBtn) toggleBtn.innerHTML = '🛒 Show order summary <span class="arrow">▼</span>';

  // Open modal
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Collapsible order summary toggle
function toggleCheckoutSummary() {
  const details = document.getElementById('checkoutSummaryDetails');
  const toggleBtn = document.querySelector('.summary-toggle-text');
  
  if (details.classList.contains('collapsed')) {
    details.classList.remove('collapsed');
    toggleBtn.innerHTML = '🛒 Hide order summary <span class="arrow">▲</span>';
  } else {
    details.classList.add('collapsed');
    toggleBtn.innerHTML = '🛒 Show order summary <span class="arrow">▼</span>';
  }
}

// Form validation & submit
function submitCheckoutForm() {
  const fieldsToValidate = [
    'chk-email',
    'chk-lname',
    'chk-address',
    'chk-city',
    'chk-phone'
  ];

  let isValid = true;
  fieldsToValidate.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.hasAttribute('required') && !el.value.trim()) {
        el.classList.add('input-error');
        isValid = false;
      } else if (id === 'chk-email' && el.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) {
        el.classList.add('input-error');
        isValid = false;
      } else {
        el.classList.remove('input-error');
      }
      
      el.oninput = function() {
        el.classList.remove('input-error');
      };
    }
  });

  if (!isValid) {
    const firstError = document.querySelector('.input-error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Save info if checked
  if (document.getElementById('chk-saveinfo').checked) {
    saveCheckoutInfo();
  } else {
    clearCheckoutInfo();
  }

  // Set customer name in success message
  const fname = document.getElementById('chk-fname').value.trim();
  const lname = document.getElementById('chk-lname').value.trim();
  const fullName = fname ? `${fname} ${lname}` : lname;
  document.getElementById('customerNameSpan').textContent = fullName;

  // Clipboard copy removed

  // Gather details for automated email
  const emailVal = document.getElementById('chk-email').value.trim();
  const phoneVal = document.getElementById('chk-phone').value.trim();
  const addressVal = document.getElementById('chk-address').value.trim();
  const apartmentVal = document.getElementById('chk-apartment').value.trim();
  const cityVal = document.getElementById('chk-city').value.trim();
  const postalVal = document.getElementById('chk-postal').value.trim();
  const countryVal = document.getElementById('chk-country').value;
  const fullAddress = `${addressVal}${apartmentVal ? ', ' + apartmentVal : ''}, ${cityVal}${postalVal ? ' - ' + postalVal : ''}, ${countryVal}`;

  let orderTotal = PRICES.box + PRICES.delivery;
  let addonsList = [];
  if (state.orderType !== 'simple') {
    if (state.top) orderTotal += PRICES.top;
    if (state.inside) orderTotal += PRICES.inside;
    if (state.addons.fairy) { orderTotal += PRICES.fairy; addonsList.push("Fairy Lights"); }
    if (state.addons.ribbon) { orderTotal += PRICES.ribbon; addonsList.push("Ribbon Bow"); }
  }

  const orderData = {
    name: fullName,
    email: emailVal,
    phone: phoneVal,
    address: fullAddress,
    boxType: state.orderType === 'simple' ? 'Simple Black Box' : 'Personalised Box',
    inkColor: state.inkColor === 'silver' ? 'Silver' : 'Golden',
    topText: (document.getElementById('ta-top') || {value:''}).value.trim(),
    insideText: (document.getElementById('ta-inside') || {value:''}).value.trim(),
    addons: addonsList.join(', ') || 'None',
    total: orderTotal.toLocaleString()
  };

  // Dispatch email to Nazi Yaqoob (Owner)
  sendOrderEmail(orderData);

  // Transition to Payment instructions
  document.getElementById('checkoutFormView').style.display = 'none';
  document.getElementById('paymentInstructionsView').style.display = 'block';
  
  // Scroll modal back to top
  const modal = document.querySelector('.modal');
  if (modal) modal.scrollTop = 0;
}

// Clipboard copy features removed

// Send order details email to owner via Web3Forms
function sendOrderEmail(orderData) {
  const payload = {
    access_key: "f3d8291b-afee-4148-880d-5884a4c7cbb0",
    subject: `New Order from ${orderData.name} - Rs. ${orderData.total}`,
    from_name: "box.love.pk Store",
    name: orderData.name,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    box_type: orderData.boxType,
    ink_color: orderData.inkColor,
    lid_message: orderData.topText || "(none)",
    inside_message: orderData.insideText || "(none)",
    addons: orderData.addons || "(none)",
    total_amount: `Rs. ${orderData.total}`,
    message: `A new order has been placed on box.love.pk!\n\n` +
             `Customer Details:\n` +
             `- Name: ${orderData.name}\n` +
             `- Email: ${orderData.email}\n` +
             `- Phone: ${orderData.phone}\n` +
             `- Address: ${orderData.address}\n\n` +
             `Box Configuration:\n` +
             `- Type: ${orderData.boxType}\n` +
             `- Ink: ${orderData.inkColor}\n` +
             `- Lid Text: ${orderData.topText || "N/A"}\n` +
             `- Inside Text: ${orderData.insideText || "N/A"}\n` +
             `- Addons: ${orderData.addons || "None"}\n\n` +
             `Total Amount: Rs. ${orderData.total}`
  };

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Order email sent to owner successfully!");
    } else {
      console.error("Failed to send order email:", data.message);
    }
  })
  .catch(err => console.error("Error sending order email:", err));
}

// LocalStorage Persistence for Checkout Form
function saveCheckoutInfo() {
  const info = {
    email: document.getElementById('chk-email').value,
    fname: document.getElementById('chk-fname').value,
    lname: document.getElementById('chk-lname').value,
    address: document.getElementById('chk-address').value,
    apartment: document.getElementById('chk-apartment').value,
    city: document.getElementById('chk-city').value,
    postal: document.getElementById('chk-postal').value,
    phone: document.getElementById('chk-phone').value,
    country: document.getElementById('chk-country').value,
    newsletter: document.getElementById('chk-newsletter').checked
  };
  localStorage.setItem('saved_checkout_details', JSON.stringify(info));
}

function loadCheckoutInfo() {
  const data = localStorage.getItem('saved_checkout_details');
  if (!data) return;
  try {
    const info = JSON.parse(data);
    document.getElementById('chk-email').value = info.email || '';
    document.getElementById('chk-fname').value = info.fname || '';
    document.getElementById('chk-lname').value = info.lname || '';
    document.getElementById('chk-address').value = info.address || '';
    document.getElementById('chk-apartment').value = info.apartment || '';
    document.getElementById('chk-city').value = info.city || '';
    document.getElementById('chk-postal').value = info.postal || '';
    document.getElementById('chk-phone').value = info.phone || '';
    document.getElementById('chk-country').value = info.country || 'Pakistan';
    document.getElementById('chk-newsletter').checked = info.newsletter !== false;
    document.getElementById('chk-saveinfo').checked = true;
  } catch (e) {
    console.error("Error parsing saved checkout info", e);
  }
}

function clearCheckoutInfo() {
  localStorage.removeItem('saved_checkout_details');
}

/* =====================================================
   HAMBURGER MENU
===================================================== */
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const isVisible = nav.style.display === 'flex';
  if (!isVisible) {
    nav.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:65px;left:0;right:0;background:rgba(255,245,248,0.98);padding:1.5rem 2rem;backdrop-filter:blur(20px);border-bottom:1px solid rgba(244,186,218,0.4);z-index:499;gap:1.2rem;';
  } else {
    nav.style.display = 'none';
  }
}

/* =====================================================
   INIT
===================================================== */
renderPreviewTabs();
updateCart();
liveUpdate();

// Restore saved messages from localStorage
['top','inside'].forEach(type => {
  const saved = localStorage.getItem('saved_' + type);
  const ta = document.getElementById('ta-' + type);
  if (saved && ta) ta.value = saved;
});

/* =============================================================
   ministers.js
   Tab VI — "Members" page with two slides:
     1. Council of Ministers  (ministers.xlsx)
     2. Officials              (officals.xlsx)
   Fetches live via SheetJS — no hardcoding.
   Full bilingual EN / TA support.
   ============================================================= */

let _ministersCache = null;
let _officialsCache = null;
let _membersActiveSlide = 'ministers'; // 'ministers' | 'officials'

/* ──────────────────────────────────────────
   DATA FETCHERS
   ────────────────────────────────────────── */
async function getMinistersData() {
  if (_ministersCache) return _ministersCache;
  try {
    const res = await fetch('/api/ministers');
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        _ministersCache = data;
        return _ministersCache;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to embedded dataset:', err);
  }
  _ministersCache = window.MINISTERS_FALLBACK_DATA || [];
  return _ministersCache;
}

async function getOfficialsData() {
  if (_officialsCache) return _officialsCache;
  try {
    const res = await fetch('/api/officials');
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        _officialsCache = data;
        return _officialsCache;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to embedded dataset:', err);
  }
  _officialsCache = window.OFFICIALS_FALLBACK_DATA || [];
  return _officialsCache;
}


/* ──────────────────────────────────────────
   MAIN ENTRY — called from core.js
   ────────────────────────────────────────── */
function renderMinistersPage(lang) {
  const container = document.getElementById('ministersContainer');
  if (!container) return;

  // Build the slide shell if not yet present
  if (!document.getElementById('membersSlideShell')) {
    container.innerHTML = buildSlideShell(lang);
    // Bind slide buttons
    document.getElementById('slideBtn-ministers').addEventListener('click', () => switchMembersSlide('ministers', lang));
    document.getElementById('slideBtn-officials').addEventListener('click', () => switchMembersSlide('officials', lang));
  } else {
    // Re-render labels on language switch
    _updateSlideLabels(lang);
  }

  // Render the active slide content
  loadAndRenderSlide(_membersActiveSlide, lang);
}

function switchMembersSlide(slide, lang) {
  _membersActiveSlide = slide;
  document.querySelectorAll('.members-slide-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`slideBtn-${slide}`).classList.add('active');
  loadAndRenderSlide(slide, lang);
}

function loadAndRenderSlide(slide, lang) {
  const body = document.getElementById('membersSlideBody');
  if (!body) return;
  body.innerHTML = `<div class="ministers-loading">${lang === 'ta' ? 'தரவு ஏற்றுகிறது…' : 'Loading data…'}</div>`;

  if (slide === 'ministers') {
    getMinistersData()
      .then(data => { body.innerHTML = buildMinistersContent(data, lang); })
      .catch(err => { body.innerHTML = errBlock(err); });
  } else {
    getOfficialsData()
      .then(data => { body.innerHTML = buildOfficialsContent(data, lang); })
      .catch(err => { body.innerHTML = errBlock(err); });
  }
}

/* ──────────────────────────────────────────
   SLIDE SHELL HTML
   ────────────────────────────────────────── */
function buildSlideShell(lang) {
  const isTa = lang === 'ta';
  return `
    <div id="membersSlideShell">
      <div class="members-slide-nav">
        <button class="members-slide-btn active" id="slideBtn-ministers">
          ${isTa ? '🏛 அமைச்சரவை' : '🏛 Council of Ministers'}
        </button>
        <button class="members-slide-btn" id="slideBtn-officials">
          ${isTa ? '⚖ சட்டப்பேரவை பதவியினர்' : '⚖ Assembly Officials'}
        </button>
      </div>
      <div id="membersSlideBody"></div>
    </div>`;
}

function _updateSlideLabels(lang) {
  const isTa = lang === 'ta';
  const bm = document.getElementById('slideBtn-ministers');
  const bo = document.getElementById('slideBtn-officials');
  if (bm) bm.innerHTML = isTa ? '🏛 அமைச்சரவை' : '🏛 Council of Ministers';
  if (bo) bo.innerHTML = isTa ? '⚖ சட்டப்பேரவை பதவியினர்' : '⚖ Assembly Officials';
}

function getAvatarPlaceholderSvg(name, party) {
  const cleanName = (name || '').replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();
  const parts = cleanName.split(/[\s\.]+/).filter(Boolean);
  let initials = 'TN';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1) {
    initials = parts[0].slice(0, 2).toUpperCase();
  }

  let accentColor = '#d30d25';
  const p = (party || '').toUpperCase();
  if (p.includes('DMK') && !p.includes('AIADMK')) accentColor = '#d30d25';
  else if (p.includes('AIADMK')) accentColor = '#12702c';
  else if (p.includes('INC')) accentColor = '#0b407a';
  else if (p.includes('BJP')) accentColor = '#ff8800';
  else if (p.includes('VCK')) accentColor = '#491a66';
  else if (p.includes('PMK')) accentColor = '#ffaa00';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="#24201c"/><rect x="5" y="5" width="190" height="230" fill="none" stroke="#3a332c" stroke-width="2"/><circle cx="100" cy="85" r="42" fill="#473f37"/><path d="M 35 210 C 35 145 165 145 165 210 Z" fill="#473f37"/><rect x="50" y="192" width="100" height="26" rx="3" fill="${accentColor}"/><text x="100" y="210" font-family="'Courier Prime', monospace" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ──────────────────────────────────────────
   MINISTERS SLIDE
   ────────────────────────────────────────── */
function buildMinistersContent(data, lang) {
  const isTa = lang === 'ta';
  const sorted = [...data].sort((a, b) => Number(a.Rank_Order) - Number(b.Rank_Order));
  const cm = sorted.find(r => Number(r.Rank_Order) === 1) || sorted[0];
  const ministers = sorted.filter(r => Number(r.Rank_Order) > 1);

  /* CM portfolios */
  const cmPortfolios = (isTa ? cm.Portfolios_TA : cm.Portfolios_EN)
    .split(';').map(p => p.trim()).filter(Boolean)
    .map(p => `<span class="cm-portfolio-tag">${p}</span>`).join('');

  const cmImgSrc = (cm.Image && cm.Image !== 'nan' && cm.Image !== 'undefined')
    ? cm.Image
    : 'https://pub-b25d504a24b04494839eefe88766f3e8.r2.dev/assets/ministers/Chief%20MInister.jpg';

  const cmBlock = `
    <div class="ministers-page-header">
      <h2>${isTa ? 'தமிழ்நாடு அமைச்சரவை · 2026' : 'Council of Ministers · Tamil Nadu 2026'}</h2>
      <span>${ministers.length + 1} ${isTa ? 'அமைச்சர்கள்' : 'Ministers'}</span>
    </div>
    <div class="cm-hero">
      <div class="cm-hero-photo">
        <img src="${cmImgSrc}" alt="${cm.Name_EN}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://pub-b25d504a24b04494839eefe88766f3e8.r2.dev/assets/ministers/Chief%20MInister.jpg';">
        <div class="cm-hero-photo-badge">${isTa ? 'முதலமைச்சர்' : 'Chief Minister'}</div>
      </div>
      <div class="cm-hero-info">
        <span class="cm-designation-tag">${isTa ? cm.Designation_TA : cm.Designation_EN}</span>
        <div class="cm-name">${cm.Name_EN}</div>
        <span class="cm-name-tamil">${cm.Name_TA}</span>
        <div class="cm-meta-row">
          <div class="cm-meta-item">
            <span class="cm-meta-label">${isTa ? 'தொகுதி' : 'Constituency'}</span>
            <span class="cm-meta-value">${isTa ? cm.Constituency_TA : cm.Constituency}</span>
          </div>
          <div class="cm-meta-item">
            <span class="cm-meta-label">${isTa ? 'கட்சி' : 'Party'}</span>
            <span class="cm-meta-value">${cm.Party}</span>
          </div>
          <div class="cm-meta-item">
            <span class="cm-meta-label">${isTa ? 'வயது' : 'Age'}</span>
            <span class="cm-meta-value">${cm.Age}</span>
          </div>
        </div>
        <div class="cm-portfolios">
          <div class="cm-portfolios-label">${isTa ? 'அலுவல் பொறுப்புகள்' : 'Portfolios Held'}</div>
          <div class="cm-portfolio-tags">${cmPortfolios}</div>
        </div>
      </div>
    </div>`;

  /* Minister cards */
  const cards = ministers.map(m => {
    const pItems = (isTa ? m.Portfolios_TA : m.Portfolios_EN)
      .split(';').map(p => p.trim()).filter(Boolean);
    const pTags = pItems.map(p => `<span class="minister-portfolio-tag">${p}</span>`).join('');
    const hoverLi = pItems.map(p => `<li>${p}</li>`).join('');

    let rawMImg = '';
    if (m.Image && m.Image !== 'nan' && m.Image !== 'undefined') rawMImg = m.Image;
    else if (m.image && m.image !== 'nan' && m.image !== 'undefined') rawMImg = m.image;
    else if (m['image url'] && m['image url'] !== 'nan') rawMImg = m['image url'];
    else if (m.image_url && m.image_url !== 'nan') rawMImg = m.image_url;

    rawMImg = (rawMImg || '').toString().trim();
    const fallbackSvg = getAvatarPlaceholderSvg(m.Name_EN, m.Party);
    const mImgSrc = rawMImg || fallbackSvg;

    return `
      <div class="minister-card">
        <div class="minister-card-photo">
          <img src="${mImgSrc}" alt="${m.Name_EN}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackSvg}';">
          <div class="minister-photo-overlay">
            <div class="minister-overlay-title">${isTa ? 'பொறுப்புகள்' : 'Portfolios'}</div>
            <ul class="minister-overlay-list">${hoverLi}</ul>
          </div>
        </div>
        <div class="minister-card-body">
          <div class="minister-rank">NO. ${m.Rank_Order}</div>
          <div class="minister-name">${m.Name_EN}</div>
          <span class="minister-name-tamil">${m.Name_TA}</span>
          <div class="minister-designation">${isTa ? m.Designation_TA : m.Designation_EN}</div>
          <div class="minister-portfolios-strip">${pTags}</div>
          <div class="minister-meta">
            <span class="minister-constituency" style="display:inline-flex; align-items:center; gap:4px;">
              ${typeof getPartyFlagHtml === 'function' ? getPartyFlagHtml(m.Party, "width: 14px; height: 9px; object-fit: cover; border-radius: 1px; border: 1px solid rgba(0,0,0,0.15);") : ""}
              ${isTa ? m.Constituency_TA : m.Constituency}
            </span>
            <span class="minister-age-badge">${m.Age}${isTa ? ' வ' : 'y'}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    ${cmBlock}
    <div class="ministers-grid-header">
      <h3>${isTa ? 'அமைச்சரவை உறுப்பினர்கள்' : 'Cabinet Ministers'}</h3>
      <span class="ministers-count-badge">${ministers.length} ${isTa ? 'அமைச்சர்கள்' : 'Ministers'}</span>
    </div>
    <div class="ministers-grid">${cards}</div>`;
}

/* ──────────────────────────────────────────
   OFFICIALS SLIDE
   ────────────────────────────────────────── */
function buildOfficialsContent(data, lang) {
  const isTa = lang === 'ta';

  const cards = data.map(o => {
    const officeDate = o.took_office
      ? (typeof o.took_office === 'object'
          ? o.took_office.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : o.took_office)
      : '';

    const blockColor = o.party_block === 'Government' || o.party_block === 'அரசு'
      ? 'var(--ink-red)' : 'var(--ink-blue, #1a4a8a)';

    let rawOImg = '';
    if (o['image url'] && o['image url'] !== 'nan') rawOImg = o['image url'];
    else if (o.image_url && o.image_url !== 'nan') rawOImg = o.image_url;
    else if (o.Image && o.Image !== 'nan') rawOImg = o.Image;
    else if (o.image && o.image !== 'nan') rawOImg = o.image;

    rawOImg = (rawOImg || '').toString().trim();
    const fallbackSvg = getAvatarPlaceholderSvg(o.name, o.party);
    const oImgSrc = rawOImg || fallbackSvg;

    return `
      <div class="official-card">
        <div class="official-photo-col">
          <div class="official-photo-wrap">
            <img src="${oImgSrc}" alt="${o.name}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fallbackSvg}';">
          </div>
          <div class="official-block-badge" style="background:${blockColor}">
            ${isTa ? o.party_block_ta : o.party_block}
          </div>
        </div>
        <div class="official-info-col">
          <div class="official-position-tag">${isTa ? o.position_ta : o.position}</div>
          <div class="official-name">${o.name}</div>
          <span class="official-name-tamil">${o.name_ta}</span>
          <div class="official-meta-row">
            <span class="official-meta-item">
              <span class="official-meta-label">${isTa ? 'கட்சி' : 'Party'}</span>
              <strong style="display:inline-flex; align-items:center; gap:4px;">
                ${typeof getPartyFlagHtml === 'function' ? getPartyFlagHtml(o.party, "width: 14px; height: 9px; object-fit: cover; border-radius: 1px; border: 1px solid rgba(0,0,0,0.15);") : ""}
                ${isTa ? o.party_ta : o.party}
              </strong>
            </span>
            <span class="official-meta-item">
              <span class="official-meta-label">${isTa ? 'தொகுதி' : 'Constituency'}</span>
              <strong>${isTa ? o.constituency_ta : o.constituency}</strong>
            </span>
            <span class="official-meta-item">
              <span class="official-meta-label">${isTa ? 'வயது' : 'Age'}</span>
              <strong>${o.age}</strong>
            </span>
            <span class="official-meta-item">
              <span class="official-meta-label">${isTa ? 'பொறுப்பேற்ற நாள்' : 'In Office Since'}</span>
              <strong>${officeDate}</strong>
            </span>
          </div>
          <div class="official-description">${isTa ? o.role_description_ta : o.role_description}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="ministers-page-header">
      <h2>${isTa ? 'சட்டப்பேரவை பதவியினர் · 2026' : 'Assembly Officials · Tamil Nadu 2026'}</h2>
      <span>${data.length} ${isTa ? 'பதவியினர்' : 'Officials'}</span>
    </div>
    <div class="officials-list">${cards}</div>`;
}

/* ── Util ── */
function errBlock(err) {
  return `<div class="ministers-error">⚠ ${err.message}</div>`;
}

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
  const res = await fetch('/api/ministers');
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ministers API`);
  _ministersCache = await res.json();
  return _ministersCache;
}

async function getOfficialsData() {
  if (_officialsCache) return _officialsCache;
  const res = await fetch('/api/officials');
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching officials API`);
  _officialsCache = await res.json();
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

/* ──────────────────────────────────────────
   MINISTERS SLIDE
   ────────────────────────────────────────── */
function buildMinistersContent(data, lang) {
  const isTa = lang === 'ta';
  const sorted = [...data].sort((a, b) => Number(a.Rank_Order) - Number(b.Rank_Order));
  const cm = sorted.find(r => Number(r.Rank_Order) === 1);
  const ministers = sorted.filter(r => Number(r.Rank_Order) > 1);

  /* CM portfolios */
  const cmPortfolios = (isTa ? cm.Portfolios_TA : cm.Portfolios_EN)
    .split(';').map(p => p.trim()).filter(Boolean)
    .map(p => `<span class="cm-portfolio-tag">${p}</span>`).join('');

  const cmBlock = `
    <div class="ministers-page-header">
      <h2>${isTa ? 'தமிழ்நாடு அமைச்சரவை · 2026' : 'Council of Ministers · Tamil Nadu 2026'}</h2>
      <span>${ministers.length + 1} ${isTa ? 'அமைச்சர்கள்' : 'Ministers'}</span>
    </div>
    <div class="cm-hero">
      <div class="cm-hero-photo">
        <img src="${cm.Image}" alt="${cm.Name_EN}" onerror="this.style.opacity=0">
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

    return `
      <div class="minister-card">
        <div class="minister-card-photo">
          <img src="${m.Image}" alt="${m.Name_EN}" loading="lazy" onerror="this.parentElement.classList.add('photo-error')">
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
            <span class="minister-constituency">${isTa ? m.Constituency_TA : m.Constituency}</span>
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

    return `
      <div class="official-card">
        <div class="official-photo-col">
          <div class="official-photo-wrap">
            <img src="${o['image url']}" alt="${o.name}" loading="lazy"
                 onerror="this.parentElement.classList.add('photo-error')">
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
              <strong>${isTa ? o.party_ta : o.party}</strong>
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

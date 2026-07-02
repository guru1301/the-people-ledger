/* =============================================================
   findings.js — Dynamic findings data loader
   ============================================================= */

let FINDINGS_DATA = [];

async function loadFindingsData() {
  try {
    const res = await fetch('/api/findings');
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching findings API`);
    FINDINGS_DATA = await res.json();
    console.log(`[Findings] Loaded ${FINDINGS_DATA.length} findings from API`);
    
    // Automatically trigger front page re-render if language is set
    if (typeof currentLang !== 'undefined' && typeof renderDynamicFrontPage === 'function') {
      renderDynamicFrontPage(currentLang);
    }
  } catch (err) {
    console.error('[Findings] Could not load findings from API:', err);
  }
}

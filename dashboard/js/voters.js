/* =============================================================
   voters.js — District ECI ledger, sort, top/bottom voter gaps
   ============================================================= */

let currentSortCol = "";
let sortAscending  = true;

const DISTRICT_NAME_MAP = {
  "Ramanathapuram": { en:"Ramanathapuram", ta:"இராமநாதபுரம்" },
  "Sivaganga":      { en:"Sivaganga",      ta:"சிவகங்கை" },
  "Perambalur":     { en:"Perambalur",     ta:"பெரம்பலூர்" },
  "Pudukkottai":    { en:"Pudukkottai",    ta:"புதுக்கோட்டை" },
  "Kanniyakumari":  { en:"Kanniyakumari",  ta:"கன்னியாகுமரி" },
  "Tiruppur":       { en:"Tiruppur",       ta:"திருப்பூர்" },
  "Kancheepuram":   { en:"Kancheepuram",   ta:"காஞ்சிபுரம்" },
  "The Nilgiris":   { en:"The Nilgiris",   ta:"நீலகிரி" },
  "Erode":          { en:"Erode",          ta:"ஈரோடு" },
  "Chengalpattu":   { en:"Chengalpattu",   ta:"செங்கல்பட்டு" },
  "Chennai Metro":  { en:"Chennai Metro",  ta:"சென்னை பெருநகரம்" },
  "Thanjavur":      { en:"Thanjavur",      ta:"தஞ்சாவூர்" },
  "Salem":          { en:"Salem",          ta:"சேலம்" },
  "Coimbatore":     { en:"Coimbatore",     ta:"கோயம்புத்தூர்" }
};

function renderDistrictLedger() {
  const tbody = document.getElementById('districtLedgerBody');
  tbody.innerHTML = "";

  document.getElementById('ledger-head-dist').innerHTML     = `${currentLang==='en'?'District':'மாவட்டம்'} <i class="fa-solid fa-sort"></i>`;
  document.getElementById('ledger-head-electors').innerHTML = `${currentLang==='en'?'Total Electors':'மொத்த வாக்காளர்கள்'} <i class="fa-solid fa-sort"></i>`;
  document.getElementById('ledger-head-turnout').innerHTML  = `${currentLang==='en'?'Turnout %':'வாக்குப்பதிவு %'} <i class="fa-solid fa-sort"></i>`;
  document.getElementById('ledger-head-gap').innerHTML      = `${currentLang==='en'?'Gender Gap':'பாலின இடைவெளி'} <i class="fa-solid fa-sort"></i>`;

  DISTRICT_DATA.forEach(d => {
    const row      = document.createElement('tr');
    const gapColor = d.gap < 0 ? "var(--ink-green)" : "var(--ink-red)";
    const gapSign  = d.gap > 0 ? "+" : "";
    const nameObj  = DISTRICT_NAME_MAP[d.name] || { en: d.name, ta: d.name };
    const dName    = currentLang === 'en' ? nameObj.en : nameObj.ta;
    row.innerHTML = `
      <td class="strong">${dName}</td>
      <td class="text-right">${d.electors.toLocaleString()}</td>
      <td class="text-right strong">${d.turnout}%</td>
      <td class="text-right strong" style="color:${gapColor}">${gapSign}${d.gap.toFixed(2)}%</td>`;
    tbody.appendChild(row);
  });
}

function sortDistrictLedger(col) {
  if (currentSortCol === col) sortAscending = !sortAscending;
  else { currentSortCol = col; sortAscending = true; }

  DISTRICT_DATA.sort((a, b) => {
    let valA, valB;
    if      (col === 'name')     { valA = a.name;     valB = b.name; }
    else if (col === 'electors') { valA = a.electors;  valB = b.electors; }
    else if (col === 'turnout')  { valA = a.turnout;   valB = b.turnout; }
    else if (col === 'gap')      { valA = a.gap;       valB = b.gap; }
    if (valA < valB) return sortAscending ? -1 : 1;
    if (valA > valB) return sortAscending ?  1 : -1;
    return 0;
  });
  renderDistrictLedger();
}

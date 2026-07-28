/* =============================================================
   voters.js — Statewide Voter Archives & 38-District ECI Registry
   ============================================================= */

let currentSortCol = "";
let sortAscending  = true;
let currentSearchQuery = "";

const DISTRICT_NAME_MAP = {
  "Ariyalur": { en: "Ariyalur", ta: "அரியலூர்" },
  "Chengalpattu": { en: "Chengalpattu", ta: "செங்கல்பட்டு" },
  "Chennai": { en: "Chennai", ta: "சென்னை" },
  "Chennai Metro": { en: "Chennai Metro", ta: "சென்னை பெருநகரம்" },
  "Coimbatore": { en: "Coimbatore", ta: "கோயம்புத்தூர்" },
  "Cuddalore": { en: "Cuddalore", ta: "கடலூர்" },
  "Dharmapuri": { en: "Dharmapuri", ta: "தருமபுரி" },
  "Dindigul": { en: "Dindigul", ta: "திண்டுக்கல்" },
  "Erode": { en: "Erode", ta: "ஈரோடு" },
  "Kallakurichi": { en: "Kallakurichi", ta: "கள்ளக்குறிச்சி" },
  "Kancheepuram": { en: "Kancheepuram", ta: "காஞ்சிபுரம்" },
  "Kanniyakumari": { en: "Kanniyakumari", ta: "கன்னியாகுமரி" },
  "Kanyakumari": { en: "Kanniyakumari", ta: "கன்னியாகுமரி" },
  "Karur": { en: "Karur", ta: "கரூர்" },
  "Krishnagiri": { en: "Krishnagiri", ta: "கிருஷ்ணகிரி" },
  "Madurai": { en: "Madurai", ta: "மதுரை" },
  "Mayiladuthurai": { en: "Mayiladuthurai", ta: "மயிலாடுதுறை" },
  "Nagapattinam": { en: "Nagapattinam", ta: "நாகப்பட்டினம்" },
  "Namakkal": { en: "Namakkal", ta: "நாமக்கல்" },
  "The Nilgiris": { en: "The Nilgiris", ta: "நீலகிரி" },
  "Nilgiris": { en: "The Nilgiris", ta: "நீலகிரி" },
  "Perambalur": { en: "Perambalur", ta: "பெரம்பலூர்" },
  "Pudukkottai": { en: "Pudukkottai", ta: "புதுக்கோட்டை" },
  "Ramanathapuram": { en: "Ramanathapuram", ta: "இராமநாதபுரம்" },
  "Ranipet": { en: "Ranipet", ta: "ராணிப்பேட்டை" },
  "Salem": { en: "Salem", ta: "சேலம்" },
  "Sivaganga": { en: "Sivaganga", ta: "சிவகங்கை" },
  "Tenkasi": { en: "Tenkasi", ta: "தென்காசி" },
  "Thanjavur": { en: "Thanjavur", ta: "தஞ்சாவூர்" },
  "Theni": { en: "Theni", ta: "தேனி" },
  "Thoothukudi": { en: "Thoothukudi", ta: "தூத்துக்குடி" },
  "Thoothukkudi": { en: "Thoothukudi", ta: "தூத்துக்குடி" },
  "Tiruchirappalli": { en: "Tiruchirappalli", ta: "திருச்சிராப்பள்ளி" },
  "Trichy": { en: "Tiruchirappalli", ta: "திருச்சிராப்பள்ளி" },
  "Tirunelveli": { en: "Tirunelveli", ta: "திருநெல்வேலி" },
  "Tirupathur": { en: "Tirupathur", ta: "திருப்பத்தூர்" },
  "Tiruppattur": { en: "Tirupathur", ta: "திருப்பத்தூர்" },
  "Tiruppur": { en: "Tiruppur", ta: "திருப்பூர்" },
  "Tiruvallur": { en: "Tiruvallur", ta: "திருவள்ளூர்" },
  "Tiruvannamalai": { en: "Tiruvannamalai", ta: "திருவண்ணாமலை" },
  "Tiruvarur": { en: "Tiruvarur", ta: "திருவாரூர்" },
  "Vellore": { en: "Vellore", ta: "வேலூர்" },
  "Viluppuram": { en: "Viluppuram", ta: "விழுப்புரம்" },
  "Virudhunagar": { en: "Virudhunagar", ta: "விருதுநகர்" }
};

function renderDistrictLedger() {
  const tbody = document.getElementById('districtLedgerBody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const distHead = document.getElementById('ledger-head-dist');
  if (distHead) distHead.innerHTML = `${typeof currentLang !== 'undefined' && currentLang==='ta'?'மாவட்டம்':'District'} <i class="fa-solid fa-sort"></i>`;
  
  const electHead = document.getElementById('ledger-head-electors');
  if (electHead) electHead.innerHTML = `${typeof currentLang !== 'undefined' && currentLang==='ta'?'மொத்த வாக்காளர்கள்':'Total Electors'} <i class="fa-solid fa-sort"></i>`;
  
  const turnHead = document.getElementById('ledger-head-turnout');
  if (turnHead) turnHead.innerHTML = `${typeof currentLang !== 'undefined' && currentLang==='ta'?'வாக்குப்பதிவு %':'Turnout %'} <i class="fa-solid fa-sort"></i>`;
  
  const gapHead = document.getElementById('ledger-head-gap');
  if (gapHead) gapHead.innerHTML = `${typeof currentLang !== 'undefined' && currentLang==='ta'?'பாலின இடைவெளி':'Gender Gap'} <i class="fa-solid fa-sort"></i>`;

  const query = currentSearchQuery.toLowerCase().trim();

  const filtered = DISTRICT_DATA.filter(d => {
    const nameObj = DISTRICT_NAME_MAP[d.name] || { en: d.name, ta: d.name };
    return (
      d.name.toLowerCase().includes(query) ||
      nameObj.en.toLowerCase().includes(query) ||
      nameObj.ta.toLowerCase().includes(query)
    );
  });

  filtered.forEach(d => {
    const row      = document.createElement('tr');
    const isFemale = d.gap > 0;
    const gapColor = isFemale ? "var(--ink-green)" : "var(--ink-red)";
    const gapIcon  = isFemale ? "♀ +" : "♂ ";
    const nameObj  = DISTRICT_NAME_MAP[d.name] || { en: d.name, ta: d.name };
    const dName    = (typeof currentLang !== 'undefined' && currentLang === 'ta') ? nameObj.ta : nameObj.en;
    
    row.innerHTML = `
      <td class="strong">${dName}</td>
      <td class="text-right" style="font-family:'Courier Prime',monospace">${d.electors.toLocaleString()}</td>
      <td class="text-right strong" style="font-family:'Courier Prime',monospace">${d.turnout}%</td>
      <td class="text-right strong" style="color:${gapColor}; font-family:'Courier Prime',monospace">
        <span style="font-size:10px; border:1px solid ${gapColor}; padding:1px 4px; border-radius:2px">${gapIcon}${d.gap.toFixed(2)}%</span>
      </td>`;
    tbody.appendChild(row);
  });

  if (filtered.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="4" class="text-center" style="font-style:italic; padding:15px; color:gray">No matching district records found.</td>`;
    tbody.appendChild(emptyRow);
  }
}

function filterDistrictLedger(query) {
  currentSearchQuery = query;
  renderDistrictLedger();
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

function exportDistrictLedgerCSV() {
  let csv = "District Name,Total Electors,Turnout %,Gender Advantage Gap %\n";
  DISTRICT_DATA.forEach(d => {
    csv += `"${d.name}",${d.electors},${d.turnout},${d.gap}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "Tamil_Nadu_ECI_Voter_Registry_2026.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

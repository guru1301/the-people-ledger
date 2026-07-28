/* =============================================================
   voters.js — District ECI ledger, sort, top/bottom voter gaps
   ============================================================= */

let currentSortCol = "";
let sortAscending  = true;

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

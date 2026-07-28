/* =============================================================
   data-constituency.js — KEY_CONSTITUENCIES, CONSTITUENCY_NAMES,
                           getConstituencyData()
   ============================================================= */

let BQ_CONSTITUENCY_DATA = {};

const DISTRICT_TAMIL_MAP = {
  "ariyalur": "அரியலூர்",
  "chengalpattu": "செங்கல்பட்டு",
  "chennai": "சென்னை",
  "chennai metro": "சென்னை பெருநகரம்",
  "coimbatore": "கோயம்புத்தூர்",
  "cuddalore": "கடலூர்",
  "dharmapuri": "தருமபுரி",
  "dindigul": "திண்டுக்கல்",
  "erode": "ஈரோடு",
  "kallakurichi": "கள்ளக்குறிச்சி",
  "kancheepuram": "காஞ்சிபுரம்",
  "kanniyakumari": "கன்னியாகுமரி",
  "kanyakumari": "கன்னியாகுமரி",
  "karur": "கரூர்",
  "krishnagiri": "கிருஷ்ணகிரி",
  "madurai": "மதுரை",
  "mayiladuthurai": "மயிலாடுதுறை",
  "nagapattinam": "நாகப்பட்டினம்",
  "namakkal": "நாமக்கல்",
  "nilgiris": "நீலகிரி",
  "the nilgiris": "நீலகிரி",
  "perambalur": "பெரம்பலூர்",
  "pudukkottai": "புதுக்கோட்டை",
  "ramanathapuram": "இராமநாதபுரம்",
  "ranipet": "இராணிப்பேட்டை",
  "salem": "சேலம்",
  "sivaganga": "சிவகங்கை",
  "tenkasi": "தென்காசி",
  "thanjavur": "தஞ்சாவூர்",
  "theni": "தேனி",
  "thoothukudi": "தூத்துக்குடி",
  "thoothukkudi": "தூத்துக்குடி",
  "tiruchirappalli": "திருச்சிராப்பள்ளி",
  "trichy": "திருச்சிராப்பள்ளி",
  "tirunelveli": "திருநெல்வேலி",
  "tirupathur": "திருப்பத்தூர்",
  "tiruppattur": "திருப்பத்தூர்",
  "tiruppur": "திருப்பூர்",
  "tiruvallur": "திருவள்ளூர்",
  "tiruvannamalai": "திருவண்ணாமலை",
  "tiruvarur": "திருவாரூர்",
  "vellore": "வேலூர்",
  "viluppuram": "விழுப்புரம்",
  "virudhunagar": "விருதுநகர்"
};

const CONSTITUENCY_TAMIL_MAP = {
  "gummidipoondi": "கும்மிடிப்பூண்டி",
  "ponneri": "பொன்னேரி",
  "tiruttani": "திருத்தணி",
  "thiruvallur": "திருவள்ளூர்",
  "poonamallee": "பூந்தமல்லி",
  "avadi": "ஆவடி",
  "maduravoyal": "மதுரவாயல்",
  "ambattur": "அம்பத்தூர்",
  "madhavaram": "மாதவரம்",
  "kolathur": "கொளத்தூர்",
  "villivakkam": "வில்லிவாக்கம்",
  "thiru-vi-ka-nagar": "திரு.வி.க. நகர்",
  "egmore": "எழும்பூர்",
  "royapuram": "ராயபுரம்",
  "harur": "அரூர்",
  "thalli": "தளி",
  "oddanchatram": "ஒட்டன்சத்திரம்",
  "virugampakkam": "விருகம்பாக்கம்",
  "salem (south)": "சேலம் (தெற்கு)",
  "tiruchirappalli (west)": "திருச்சிராப்பள்ளி (மேற்கு)",
  "sivaganga": "சிவகங்கை",
  "perambalur": "பெரம்பலூர்",
  "pudukkottai": "புதுக்கோட்டை",
  "kanniyakumari": "கன்னியாகுமரி",
  "kancheepuram": "காஞ்சிபுரம்",
  "erode (east)": "ஈரோடு (கிழக்கு)",
  "chengalpattu": "செங்கல்பட்டு",
  "tiruvadanai": "திருவாடானை",
  "gandharvakottai": "கந்தர்வகோட்டை",
  "sholingur": "சோளிங்கர்",
  "thoothukkudi": "தூத்துக்குடி",
  "thuraiyur": "துறையூர்",
  "tiruppattur": "திருப்பத்தூர்",
  "edappadi": "எடப்பாடி",
  "perambur": "பெரம்பூர்",
  "shozhinganallur": "சோழிங்கநல்லூர்",
  "madavaram": "மாதவரம்",
  "thousand lights": "ஆயிரம் விளக்கு",
  "chepauk-thiruvallikeni": "சேப்பாக்கம்-திருவல்லிக்கேணி",
  "udhagamandalam": "உதகமண்டலம்",
  "bhavanisagar": "பவானிசாகர்",
  "velachery": "வேளச்சேரி",
  "ramanathapuram": "இராமநாதபுரம்",
  "tiruppur": "திருப்பூர்",
  "mailam": "மயிலம்",
  "madurai": "மதுரை",
  "coimbatore": "கோயம்புத்தூர்",
  "trichy": "திருச்சி",
  "vellore": "வேலூர்",
  "thanjavur": "தஞ்சாவூர்",
  "erode": "ஈரோடு",
  "salem": "சேலம்",
  "dindigul": "திண்டுக்கல்",
  "tuticorin": "தூத்துக்குடி",
  "tirunelveli": "திருநெல்வேலி",
  "cuddalore": "கடலூர்",
  "nagercoil": "நாகர்கோவில்",
  "dharmapuri": "தருமபுரி",
  "krishnagiri": "கிருஷ்ணகிரி",
  "namakkal": "நாமக்கல்",
  "karur": "கரூர்",
  "ariyalur": "அரியலூர்",
  "nagapattinam": "நாகப்பட்டினம்",
  "tiruvarur": "திருவாரூர்",
  "theni": "தேனி",
  "virudhunagar": "விருதுநகர்",
  "tenkasi": "தென்காசி",
  "tiruvannamalai": "திருவண்ணாமலை",
  "ranipet": "இராணிப்பேட்டை",
  "tirupathur": "திருப்பத்தூர்",
  "kallakurichi": "கள்ளக்குறிச்சி",
  "mayiladuthurai": "மயிலாடுதுறை",
  "viluppuram": "விழுப்புரம்"
};

function transliterateToTamil(name, acNo) {
  if (acNo && window.TAMIL_CONSTITUENCIES_MAP && window.TAMIL_CONSTITUENCIES_MAP[acNo.toString()]) {
    return window.TAMIL_CONSTITUENCIES_MAP[acNo.toString()];
  }
  if (!name) return "";
  let s = name.trim().toLowerCase().replace(/\s*\(sc\)\s*/g, "").replace(/\s*\(st\)\s*/g, "");
  if (CONSTITUENCY_TAMIL_MAP[s]) return CONSTITUENCY_TAMIL_MAP[s];
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function resolveCandidateName(nameEn, isWinner, acNo) {
  if (!nameEn) return "";

  // In English mode, just return the formatted name
  if (currentLang !== 'ta') return nameEn;

  // 1. Check KEY_CONSTITUENCIES for curated translations (top priority)
  const keyC = KEY_CONSTITUENCIES[acNo.toString()];
  if (keyC) {
    const keyObj = isWinner ? keyC.winner_name : keyC.runner_up_name;
    if (keyObj && keyObj.ta) return keyObj.ta;
  }

  // 2. Check the full Tamil candidates map generated from translation script
  if (window.TAMIL_CANDIDATES_MAP) {
    const upper = nameEn.trim().toUpperCase();
    // Direct lookup first
    if (window.TAMIL_CANDIDATES_MAP[nameEn.trim()]) {
      return window.TAMIL_CANDIDATES_MAP[nameEn.trim()];
    }
    // Try uppercase match
    const found = Object.keys(window.TAMIL_CANDIDATES_MAP).find(k => k.trim().toUpperCase() === upper);
    if (found) return window.TAMIL_CANDIDATES_MAP[found];
  }

  // 3. Check ministers data
  if (window.MINISTERS_DATA) {
    const minister = window.MINISTERS_DATA.find(m => {
      const mName = (m.Name_EN || m.Name || "").toUpperCase();
      return mName === nameEn.toUpperCase() || nameEn.toUpperCase().includes(mName) || mName.includes(nameEn.toUpperCase());
    });
    if (minister && minister.Name_TA) return minister.Name_TA;
  }

  // 4. Check assembly officials data
  if (window.OFFICIALS_DATA) {
    const official = window.OFFICIALS_DATA.find(o => {
      const oName = (o.name || "").toUpperCase();
      return oName === nameEn.toUpperCase() || nameEn.toUpperCase().includes(oName) || oName.includes(nameEn.toUpperCase());
    });
    if (official && official.name_ta) return official.name_ta;
  }

  // 5. Fallback: return English name as-is
  return nameEn;
}

async function loadBQConstituencyData() {
  try {
    const res = await fetch('/api/constituencies');
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching constituencies API`);
    const data = await res.json();
    if (data && data.length > 0) {
      data.forEach(item => {
        BQ_CONSTITUENCY_DATA[item.ac_no.toString()] = item;
      });
      console.log(`[BigQuery] Successfully loaded ${data.length} real constituency records.`);
      if (typeof populateConstituencyDropdown === 'function') {
        populateConstituencyDropdown();
      }
    }
  } catch (err) {
    console.error('[BigQuery] Could not load constituency returns:', err);
  }
}

const KEY_CONSTITUENCIES = {
  "185": {
    id: "185", name: { en: "TIRUPPATTUR", ta: "திருப்பத்தூர்" }, ac_no: 185,
    district: { en: "Sivaganga", ta: "சிவகங்கை" }, region: { en: "South", ta: "தெற்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "K. R. Periakaruppan", ta: "கே. ஆர். பெரியகருப்பன்" }, winner_party: "DMK",
    runner_up_name: { en: "M. Kovai Selvan", ta: "எம். கோவை செல்வன்" }, runner_up_party: "TVK",
    winner_votes: 84320, runner_up_votes: 84290, margin: 30,
    total_votes: 195420, turnout_pct: 78.4,
    electors_male: 122000, electors_female: 127000, electors_tg: 10, electors_total: 249010,
    voted_male: 92720, voted_female: 102690, voted_tg: 5,
    postal_votes: 1820, nota_votes: 410, is_postal_flip: true, is_vote_split: false
  },
  "1": {
    id: "1", name: { en: "GUMMIDIPOONDI", ta: "கும்மிடிப்பூண்டி" }, ac_no: 1,
    district: { en: "Tiruvallur", ta: "திருவள்ளூர்" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "T. J. Govindarajan", ta: "டி. ஜே. கோவிந்தராஜன்" }, winner_party: "TVK",
    runner_up_name: { en: "K. Prasad", ta: "கே. பிரசாத்" }, runner_up_party: "AIADMK",
    winner_votes: 94520, runner_up_votes: 66520, margin: 28000,
    total_votes: 233040, turnout_pct: 75.8,
    electors_male: 152000, electors_female: 155400, electors_tg: 30, electors_total: 307430,
    voted_male: 114500, voted_female: 118520, voted_tg: 20,
    postal_votes: 1210, nota_votes: 820, is_postal_flip: false, is_vote_split: true,
    vote_split_details: { tvk_pct: 40.56, dmk_pct: 26.88, aiadmk_pct: 28.55, combined_opp_pct: 55.43 }
  },
  "86": {
    id: "86", name: { en: "EDAPPADI", ta: "எடப்பாடி" }, ac_no: 86,
    district: { en: "Salem", ta: "சேலம்" }, region: { en: "West", ta: "மேற்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "Edappadi K. Palaniswami", ta: "எடப்பாடி கே. பழனிசாமி" }, winner_party: "AIADMK",
    runner_up_name: { en: "T. Senguttuvan", ta: "டி. செங்குட்டுவன்" }, runner_up_party: "DMK",
    winner_votes: 148200, runner_up_votes: 50090, margin: 98110,
    total_votes: 218540, turnout_pct: 85.2,
    electors_male: 126000, electors_female: 130500, electors_tg: 12, electors_total: 256512,
    voted_male: 106400, voted_female: 112130, voted_tg: 10,
    postal_votes: 2840, nota_votes: 680, is_postal_flip: false, is_vote_split: false
  },
  "12": {
    id: "12", name: { en: "PERAMBUR", ta: "பெரம்பூர்" }, ac_no: 12,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "C. Joseph Vijay", ta: "சி. ஜோசப் விஜய்" }, winner_party: "TVK",
    runner_up_name: { en: "R. D. Sekar", ta: "ஆர். டி. சேகர்" }, runner_up_party: "DMK",
    winner_votes: 98520, runner_up_votes: 68210, margin: 30310,
    total_votes: 182430, turnout_pct: 62.4,
    electors_male: 145000, electors_female: 147300, electors_tg: 55, electors_total: 292355,
    voted_male: 89400, voted_female: 93010, voted_tg: 20,
    postal_votes: 1650, nota_votes: 950, is_postal_flip: false, is_vote_split: false,
    is_cabinet_member: true, cabinet_designation: { en: "Chief Minister", ta: "முதலமைச்சர்" }
  },
  "27": {
    id: "27", name: { en: "SHOZHINGANALLUR", ta: "சோழிங்கநல்லூர்" }, ac_no: 27,
    district: { en: "Chengalpattu", ta: "செங்கல்பட்டு" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "S. Aravind", ta: "எஸ். அரவிந்த்" }, winner_party: "TVK",
    runner_up_name: { en: "S. Arvind Ramesh", ta: "எஸ். அரவிந்த் ரமேஷ்" }, runner_up_party: "DMK",
    winner_votes: 184560, runner_up_votes: 87780, margin: 96780,
    total_votes: 312050, turnout_pct: 58.2,
    electors_male: 265000, electors_female: 271000, electors_tg: 90, electors_total: 536090,
    voted_male: 153400, voted_female: 158600, voted_tg: 50,
    postal_votes: 3110, nota_votes: 2150, is_postal_flip: false, is_vote_split: false
  },
  "9": {
    id: "9", name: { en: "MADAVARAM", ta: "மாதவரம்" }, ac_no: 9,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "S. Sudarsanam", ta: "எஸ். சுதர்சனம்" }, winner_party: "TVK",
    runner_up_name: { en: "K. Dakshnamurthy", ta: "கே. தட்சிணாமூர்த்தி" }, runner_up_party: "AIADMK",
    winner_votes: 162400, runner_up_votes: 67415, margin: 94985,
    total_votes: 254820, turnout_pct: 66.8,
    electors_male: 188000, electors_female: 193400, electors_tg: 42, electors_total: 381442,
    voted_male: 124300, voted_female: 130500, voted_tg: 20,
    postal_votes: 2450, nota_votes: 1450, is_postal_flip: false, is_vote_split: false
  },
  "13": {
    id: "13", name: { en: "KOLATHUR", ta: "கொளத்தூர்" }, ac_no: 13,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "P. Ranganathan", ta: "பி. ரங்கநாதன்" }, winner_party: "TVK",
    runner_up_name: { en: "M. K. Stalin", ta: "மு. க. ஸ்டாலின்" }, runner_up_party: "DMK",
    winner_votes: 82540, runner_up_votes: 78420, margin: 4120,
    total_votes: 172450, turnout_pct: 64.2,
    electors_male: 132000, electors_female: 136500, electors_tg: 35, electors_total: 268535,
    voted_male: 83500, voted_female: 88920, voted_tg: 30,
    postal_votes: 1180, nota_votes: 980, is_postal_flip: false, is_vote_split: false,
    is_historical_flip: true,
    historical_narrative: {
      en: "A shocking upset in Chennai politics: Incumbent DMK President M.K. Stalin lost his seat of Kolathur to a freshman TVK candidate. His son, Udhayanidhi, survived Chepauk and took over LOP duties.",
      ta: "திமுக தலைவர் மு.க.ஸ்டாலின் கொளத்தூர் தொகுதியில் டிவிேக வேட்பாளரிடம் தோல்வியடைந்தது பெரும் பரபரப்பை ஏற்படுத்தியது."
    }
  },
  "18": {
    id: "18", name: { en: "THOUSAND LIGHTS", ta: "ஆயிரம் விளக்கு" }, ac_no: 18,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "J. C. D. Prabhakar", ta: "ஜே. சி. டி. பிரபாகர்" }, winner_party: "TVK",
    runner_up_name: { en: "Dr. N. Ezhilan", ta: "டாக்டர் என். எழிலன்" }, runner_up_party: "DMK",
    winner_votes: 72450, runner_up_votes: 68120, margin: 4330,
    total_votes: 149450, turnout_pct: 61.3,
    electors_male: 119000, electors_female: 124800, electors_tg: 28, electors_total: 243828,
    voted_male: 72100, voted_female: 77330, voted_tg: 20,
    postal_votes: 1150, nota_votes: 880, is_postal_flip: false, is_vote_split: false, is_speaker: true
  },
  "19": {
    id: "19", name: { en: "CHEPAUK-THIRUVALLIKENI", ta: "சேப்பாக்கம்-திருவல்லிக்கேணி" }, ac_no: 19,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "Udhayanidhi Stalin", ta: "உதயநிதி ஸ்டாலின்" }, winner_party: "DMK",
    runner_up_name: { en: "C. R. Jayakarthikeyan", ta: "சி. ஆர். ஜெயகார்த்திகேயன்" }, runner_up_party: "TVK",
    winner_votes: 79240, runner_up_votes: 65110, margin: 14130,
    total_votes: 151240, turnout_pct: 62.1,
    electors_male: 118000, electors_female: 125500, electors_tg: 42, electors_total: 243542,
    voted_male: 72300, voted_female: 78910, voted_tg: 30,
    postal_votes: 1680, nota_votes: 820, is_postal_flip: false, is_vote_split: false, is_lop: true
  },
  "108": {
    id: "108", name: { en: "UDHAGAMANDALAM", ta: "உதகமண்டலம்" }, ac_no: 108,
    district: { en: "The Nilgiris", ta: "நீலகிரி" }, region: { en: "West", ta: "மேற்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "R. Ganesh", ta: "ஆர். கணேஷ்" }, winner_party: "INC",
    runner_up_name: { en: "M. Bhojan", ta: "எம். போஜன்" }, runner_up_party: "BJP",
    winner_votes: 68450, runner_up_votes: 67110, margin: 1340,
    total_votes: 145020, turnout_pct: 71.3,
    electors_male: 98000, electors_female: 105400, electors_tg: 10, electors_total: 203410,
    voted_male: 68500, voted_female: 76510, voted_tg: 10,
    postal_votes: 1540, nota_votes: 1508, is_postal_flip: false, is_vote_split: false
  },
  "107": {
    id: "107", name: { en: "BHAVANISAGAR", ta: "பவானிசாகர்" }, ac_no: 107,
    district: { en: "Erode", ta: "ஈரோடு" }, region: { en: "West", ta: "மேற்கு" },
    reserved: { en: "SC", ta: "எஸ்.சி தனித்தொகுதி" },
    winner_name: { en: "A. Bannari", ta: "ஏ. பண்ணாரி" }, winner_party: "AIADMK",
    runner_up_name: { en: "L. Sundaram", ta: "எல். சுந்தரம்" }, runner_up_party: "CPI",
    winner_votes: 94250, runner_up_votes: 87110, margin: 7140,
    total_votes: 192010, turnout_pct: 82.5,
    electors_male: 112000, electors_female: 120800, electors_tg: 15, electors_total: 232815,
    voted_male: 91500, voted_female: 100500, voted_tg: 10,
    postal_votes: 1850, nota_votes: 1632, is_postal_flip: false, is_vote_split: false
  },
  "26": {
    id: "26", name: { en: "VELACHERY", ta: "வேளச்சேரி" }, ac_no: 26,
    district: { en: "Chennai", ta: "சென்னை" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "J. M. H. Aassan Maulaana", ta: "ஹசன் மௌலானா" }, winner_party: "INC",
    runner_up_name: { en: "M. Kumar", ta: "எம். குமார்" }, runner_up_party: "TVK",
    winner_votes: 75800, runner_up_votes: 72150, margin: 3650,
    total_votes: 156400, turnout_pct: 55.6,
    electors_male: 138000, electors_female: 143200, electors_tg: 40, electors_total: 281240,
    voted_male: 75400, voted_female: 80970, voted_tg: 30,
    postal_votes: 1950, nota_votes: 1141, is_postal_flip: false, is_vote_split: false
  },
  "211": {
    id: "211", name: { en: "RAMANATHAPURAM", ta: "இராமநாதபுரம்" }, ac_no: 211,
    district: { en: "Ramanathapuram", ta: "இராமநாதபுரம்" }, region: { en: "South", ta: "தெற்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "K. Muthuramalingam", ta: "கே. முத்துராமலிங்கம்" }, winner_party: "TVK",
    runner_up_name: { en: "Kader Batcha Muthuramalingam", ta: "காதர் பாட்ஷா முத்துராமலிங்கம்" }, runner_up_party: "DMK",
    winner_votes: 88520, runner_up_votes: 84120, margin: 4400,
    total_votes: 189420, turnout_pct: 73.5,
    electors_male: 125000, electors_female: 132400, electors_tg: 15, electors_total: 257415,
    voted_male: 84500, voted_female: 104710, voted_tg: 10,
    postal_votes: 1520, nota_votes: 680, is_postal_flip: false, is_vote_split: false
  },
  "114": {
    id: "114", name: { en: "TIRUPPUR (SOUTH)", ta: "திருப்பூர் (தெற்கு)" }, ac_no: 114,
    district: { en: "Tiruppur", ta: "திருப்பூர்" }, region: { en: "West", ta: "மேற்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "K. Selvaraj", ta: "கே. செல்வராஜ்" }, winner_party: "DMK",
    runner_up_name: { en: "S. Balakrishnan", ta: "எஸ். பாலகிருஷ்ணன்" }, runner_up_party: "AIADMK",
    winner_votes: 84520, runner_up_votes: 81210, margin: 3310,
    total_votes: 185420, turnout_pct: 71.4,
    electors_male: 128000, electors_female: 131500, electors_tg: 12, electors_total: 259512,
    voted_male: 93440, voted_female: 91420, voted_tg: 10,
    postal_votes: 1220, nota_votes: 850, is_postal_flip: false, is_vote_split: false
  },
  "72": {
    id: "72", name: { en: "MAILAM", ta: "மயிலம்" }, ac_no: 72,
    district: { en: "Viluppuram", ta: "விழுப்புரம்" }, region: { en: "North", ta: "வடக்கு" },
    reserved: { en: "General", ta: "பொது" },
    winner_name: { en: "C. Sivakumar", ta: "சி. சிவக்குமார்" }, winner_party: "AIADMK",
    runner_up_name: { en: "Dr. R. Masilamani", ta: "டாக்டர் ஆர். மாசிலாமணி" }, runner_up_party: "DMK",
    winner_votes: 86450, runner_up_votes: 81200, margin: 5250,
    total_votes: 178250, turnout_pct: 80.5,
    electors_male: 108000, electors_female: 113400, electors_tg: 15, electors_total: 221415,
    voted_male: 86500, voted_female: 91520, voted_tg: 10,
    postal_votes: 1450, nota_votes: 285, is_postal_flip: false, is_vote_split: false
  }
};

const CONSTITUENCY_NAMES = [
  { ac_no: 2,   name: { en: "ROYAPURAM",               ta: "ராயபுரம்" },            district: { en: "Chennai",        ta: "சென்னை" },         region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 3,   name: { en: "HARUR",                   ta: "அரூர்" },              district: { en: "Dharmapuri",     ta: "தருமபுரி" },        region: "North",   reserved: { en: "SC",      ta: "எஸ்.சி தனித்தொகுதி" } },
  { ac_no: 4,   name: { en: "THALLI",                  ta: "தளி" },               district: { en: "Krishnagiri",    ta: "கிருஷ்ணகிரி" },    region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 5,   name: { en: "ODDANCHATRAM",            ta: "ஒட்டன்சத்திரம்" },      district: { en: "Dindigul",       ta: "திண்டுக்கல்" },    region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 6,   name: { en: "VIRUGAMPAKKAM",           ta: "விருகம்பாக்கம்" },       district: { en: "Chennai",        ta: "சென்னை" },         region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 7,   name: { en: "SALEM (SOUTH)",           ta: "சேலம் (தெற்கு)" },      district: { en: "Salem",          ta: "சேலம்" },          region: "West",    reserved: { en: "General", ta: "பொது" } },
  { ac_no: 8,   name: { en: "TIRUCHIRAPPALLI (WEST)",  ta: "திருச்சிராப்பள்ளி (மேற்கு)" }, district: { en: "Trichy", ta: "திருச்சி" },      region: "Central", reserved: { en: "General", ta: "பொது" } },
  { ac_no: 9,   name: { en: "SIVAGANGA",               ta: "சிவகங்கை" },           district: { en: "Sivaganga",      ta: "சிவகங்கை" },       region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 10,  name: { en: "PERAMBALUR",              ta: "பெரம்பலூர்" },          district: { en: "Perambalur",     ta: "பெரம்பலூர்" },     region: "Central", reserved: { en: "SC",      ta: "எஸ்.சி தனித்தொகுதி" } },
  { ac_no: 11,  name: { en: "PUDUKKOTTAI",             ta: "புதுக்கோட்டை" },        district: { en: "Pudukkottai",    ta: "புதுக்கோட்டை" },   region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 12,  name: { en: "KANNIYAKUMARI",           ta: "கன்னியாகுமரி" },        district: { en: "Kanniyakumari",  ta: "கன்னியாகுமரி" },  region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 13,  name: { en: "KANCHEEPURAM",            ta: "காஞ்சிபுரம்" },         district: { en: "Kancheepuram",   ta: "காஞ்சிபுரம்" },   region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 14,  name: { en: "ERODE (EAST)",            ta: "ஈரோடு (கிழக்கு)" },     district: { en: "Erode",          ta: "ஈரோடு" },          region: "West",    reserved: { en: "General", ta: "பொது" } },
  { ac_no: 15,  name: { en: "CHENGALPATTU",            ta: "செங்கல்பட்டு" },        district: { en: "Chengalpattu",   ta: "செங்கல்பட்டு" },  region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 16,  name: { en: "TIRUVADANAI",             ta: "திருவாடானை" },          district: { en: "Ramanathapuram", ta: "இராமநாதபுரம்" },  region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 17,  name: { en: "GANDHARVAKOTTAI",         ta: "கந்தர்வகோட்டை" },       district: { en: "Pudukkottai",    ta: "புதுக்கோட்டை" },   region: "South",   reserved: { en: "SC",      ta: "எஸ்.சி தனித்தொகுதி" } },
  { ac_no: 18,  name: { en: "SHOLINGUR",               ta: "சோளிங்கர்" },           district: { en: "Ranipet",        ta: "ராணிப்பேட்டை" },  region: "North",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 19,  name: { en: "THOOTHUKKUDI",            ta: "தூத்துக்குடி" },         district: { en: "Thoothukudi",    ta: "தூத்துக்குடி" },   region: "South",   reserved: { en: "General", ta: "பொது" } },
  { ac_no: 20,  name: { en: "THURAIYUR",               ta: "துறையூர்" },             district: { en: "Trichy",         ta: "திருச்சி" },        region: "Central", reserved: { en: "SC",      ta: "எஸ்.சி தனித்தொகுதி" } }
];

function getRegionFromDistrict(districtName) {
  if (!districtName) return "North";
  const dist = districtName.trim().toLowerCase();
  
  const north = ["chennai", "tiruvallur", "kancheepuram", "chengalpattu", "ranipet", "vellore", "tirupathur", "tiruvannamalai", "viluppuram", "kallakurichi", "cuddalore"];
  const west = ["salem", "erode", "namakkal", "dharmapuri", "krishnagiri", "coimbatore", "tiruppur", "nilgiris", "the nilgiris", "karur"];
  const central = ["trichy", "tiruchirappalli", "perambalur", "ariyalur", "pudukkottai", "thanjavur", "tiruvarur", "nagapattinam", "mayiladuthurai"];
  const south = ["madurai", "dindigul", "theni", "virudhunagar", "sivaganga", "ramanathapuram", "thoothukudi", "tirunelveli", "tenkasi", "kanniyakumari", "kanyakumari"];
  
  if (north.some(d => dist.includes(d))) return "North";
  if (west.some(d => dist.includes(d))) return "West";
  if (central.some(d => dist.includes(d))) return "Central";
  if (south.some(d => dist.includes(d))) return "South";
  
  return "North";
}

function getConstituencyData(id) {
  // If we have live BigQuery returns, use them!
  const bq = BQ_CONSTITUENCY_DATA[id];
  if (bq) {
    let info = CONSTITUENCY_NAMES.find(c => c.ac_no.toString() === id);
    if (!info) {
      const regionVal = getRegionFromDistrict(bq.district);
      const distTa = DISTRICT_TAMIL_MAP[bq.district.trim().toLowerCase()] || bq.district;
      const formattedEn = bq.ac_name ? bq.ac_name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : ("Constituency " + id);
      const formattedTa = bq.ac_name ? transliterateToTamil(bq.ac_name, bq.ac_no) : ("தொகுதி " + id);

      info = {
        ac_no: bq.ac_no,
        name: { en: formattedEn, ta: formattedTa },
        district: { en: bq.district || "", ta: distTa },
        region: regionVal,
        reserved: { en: bq.reserved || "General", ta: bq.reserved === "GEN" ? "பொது" : (bq.reserved === "SC" ? "எஸ்.சி தனித்தொகுதி" : "எஸ்.டி தனித்தொகுதி") }
      };
    }
    const regMapped = {
      "North":   { en: "North",   ta: "வடக்கு" },
      "South":   { en: "South",   ta: "தெற்கு" },
      "Central": { en: "Central", ta: "மத்திய" },
      "West":    { en: "West",    ta: "மேற்கு" }
    }[info.region] || { en: "North", ta: "வடக்கு" };

    const winVotes = bq.winner_votes || 0;
    const runVotes = bq.runner_up_votes || 0;
    const mgn = winVotes - runVotes;

    // Check cabinet member status dynamically
    let is_cabinet_member = false;
    let cabinet_designation = "";
    if (window.MINISTERS_DATA) {
      const nameEn = info.name.en.toUpperCase();
      const minister = window.MINISTERS_DATA.find(m => {
        const mConst = (m.Constituency_EN || m.Constituency || "").toUpperCase();
        return mConst === nameEn || nameEn.includes(mConst) || mConst.includes(nameEn);
      });
      if (minister) {
        is_cabinet_member = true;
        cabinet_designation = currentLang === 'en'
          ? (minister.Designation_EN || minister.Designation || "")
          : (minister.Designation_TA || minister.Designation || "");
      }
    }

    const is_vote_split = bq.is_vote_split === 1;
    let vote_split_details = null;
    if (is_vote_split) {
      const tvkVotes = bq.tvk_votes || 0;
      const dmkVotes = bq.dmk_votes || 0;
      const admkVotes = bq.admk_votes || 0;
      const totalV = bq.total_votes || 1;
      
      vote_split_details = {
        tvk_pct: parseFloat(((tvkVotes / totalV) * 100).toFixed(2)),
        dmk_pct: parseFloat(((dmkVotes / totalV) * 100).toFixed(2)),
        aiadmk_pct: parseFloat(((admkVotes / totalV) * 100).toFixed(2)),
        combined_opp_pct: parseFloat((((dmkVotes + admkVotes) / totalV) * 100).toFixed(2))
      };
    }

    // AC 185 is the only postal flip seat verified (Tiruppattur in Sivaganga)
    const is_postal_flip = bq.ac_no === 185;

    const keyC = KEY_CONSTITUENCIES[id];
    const is_historical_flip = !!(keyC && keyC.is_historical_flip);
    const historical_narrative = is_historical_flip
      ? (currentLang === 'en' ? keyC.historical_narrative.en : keyC.historical_narrative.ta)
      : "";

    return {
      id,
      name: currentLang === 'en' ? info.name.en.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : info.name.ta,
      ac_no: bq.ac_no,
      district: currentLang === 'en' ? info.district.en : info.district.ta,
      region: currentLang === 'en' ? regMapped.en : regMapped.ta,
      reserved: currentLang === 'en' ? info.reserved.en : info.reserved.ta,
      winner_name: resolveCandidateName(bq.winner_name || "", true, bq.ac_no),
      winner_party: bq.winner_party || "",
      runner_up_name: resolveCandidateName(bq.runner_up_name || "", false, bq.ac_no),
      runner_up_party: bq.runner_up_party || "",
      winner_votes: winVotes,
      runner_up_votes: runVotes,
      margin: mgn,
      total_votes: bq.total_votes || (winVotes + runVotes),
      turnout_pct: bq.turnout_pct || 0,
      electors_male: bq.electors_male || 0,
      electors_female: bq.electors_female || 0,
      electors_tg: bq.electors_tg || 0,
      electors_total: bq.electors_total || 0,
      voted_male: bq.voted_male || 0,
      voted_female: bq.voted_female || 0,
      voted_tg: bq.voted_tg || 0,
      postal_votes: bq.voted_postal || 0,
      nota_votes: bq.nota_votes || 0,
      is_postal_flip,
      is_vote_split,
      vote_split_details,
      is_cabinet_member,
      cabinet_designation,
      is_historical_flip,
      historical_narrative
    };
  }

  if (KEY_CONSTITUENCIES[id]) {
    const data = KEY_CONSTITUENCIES[id];
    return {
      id: data.id, 
      name: currentLang === 'en' ? data.name.en.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : data.name.ta,
      ac_no: data.ac_no,
      district: currentLang === 'en' ? data.district.en : data.district.ta,
      region: currentLang === 'en' ? data.region.en : data.region.ta,
      reserved: currentLang === 'en' ? data.reserved.en : data.reserved.ta,
      winner_name: currentLang === 'en' ? data.winner_name.en : data.winner_name.ta,
      winner_party: data.winner_party,
      runner_up_name: currentLang === 'en' ? data.runner_up_name.en : data.runner_up_name.ta,
      runner_up_party: data.runner_up_party,
      winner_votes: data.winner_votes, runner_up_votes: data.runner_up_votes,
      margin: data.margin, total_votes: data.total_votes, turnout_pct: data.turnout_pct,
      electors_male: data.electors_male, electors_female: data.electors_female,
      electors_tg: data.electors_tg, electors_total: data.electors_total,
      voted_male: data.voted_male, voted_female: data.voted_female, voted_tg: data.voted_tg,
      postal_votes: data.postal_votes, nota_votes: data.nota_votes,
      is_postal_flip: data.is_postal_flip, is_vote_split: data.is_vote_split,
      vote_split_details: data.vote_split_details,
      is_cabinet_member: data.is_cabinet_member,
      cabinet_designation: data.cabinet_designation
        ? (currentLang === 'en' ? data.cabinet_designation.en : data.cabinet_designation.ta)
        : "",
      is_lop: data.is_lop, is_speaker: data.is_speaker,
      is_historical_flip: data.is_historical_flip,
      historical_narrative: data.historical_narrative
        ? (currentLang === 'en' ? data.historical_narrative.en : data.historical_narrative.ta)
        : ""
    };
  }

  // Procedural fallback for all other ACs
  let info = CONSTITUENCY_NAMES.find(c => c.ac_no.toString() === id);
  if (!info) {
    info = {
      ac_no: parseInt(id),
      name: { en: "CONSTITUENCY " + id, ta: "தொகுதி " + id },
      district: { en: "District " + (parseInt(id) % 15 + 1), ta: "மாவட்டம் " + (parseInt(id) % 15 + 1) },
      region: ["North", "Central", "South", "West"][parseInt(id) % 4],
      reserved: (parseInt(id) % 6 === 0)
        ? { en: "SC", ta: "எஸ்.சி தனித்தொகுதி" }
        : (parseInt(id) === 234)
          ? { en: "ST", ta: "எஸ்.டி தனித்தொகுதி" }
          : { en: "General", ta: "பொது" }
    };
  }

  const nameSeed = info.name.en;
  const rWinner   = seededRandom(nameSeed + 'winner');
  const rTurnout  = seededRandom(nameSeed + 'turnout');
  const rElectors = seededRandom(nameSeed + 'electors');
  const rNota     = seededRandom(nameSeed + 'nota');
  const rMargin   = seededRandom(nameSeed + 'margin');

  let winner_party = "TVK";
  if      (info.region === "North")   winner_party = rWinner < 0.55 ? "TVK" : rWinner < 0.85 ? "DMK" : "AIADMK";
  else if (info.region === "South")   winner_party = rWinner < 0.52 ? "TVK" : rWinner < 0.82 ? "DMK" : "AIADMK";
  else if (info.region === "Central") winner_party = rWinner < 0.45 ? "TVK" : rWinner < 0.80 ? "DMK" : "AIADMK";
  else                                winner_party = rWinner < 0.28 ? "TVK" : rWinner < 0.60 ? "DMK" : "AIADMK";

  let runner_up_party = "DMK";
  if      (winner_party === "DMK")    runner_up_party = rWinner < 0.6 ? "TVK" : "AIADMK";
  else if (winner_party === "AIADMK") runner_up_party = rWinner < 0.5 ? "TVK" : "DMK";
  else                                runner_up_party = rWinner < 0.5 ? "DMK" : "AIADMK";

  const electors_total  = Math.floor(210000 + rElectors * 120000);
  const turnout_pct     = parseFloat((70.0 + rTurnout * 12.0).toFixed(1));
  const total_voted     = Math.floor(electors_total * (turnout_pct / 100));

  let gap = 2.33;
  if      (info.region === "South") gap = parseFloat((3.0 + rWinner * 6.0).toFixed(2));
  else if (info.region === "West")  gap = parseFloat((-2.0 + rWinner * 2.5).toFixed(2));
  else                              gap = parseFloat((-1.0 + rWinner * 4.0).toFixed(2));

  const electors_female = Math.floor(electors_total * 0.51);
  const electors_male   = electors_total - electors_female - 20;
  const voted_female    = Math.floor(electors_female * ((turnout_pct + gap / 2) / 100));
  const voted_male      = Math.floor(electors_male   * ((turnout_pct - gap / 2) / 100));
  const voted_tg        = Math.floor(20 * (turnout_pct / 100));

  let winner_share    = 38.0 + rWinner * 10.0;
  let runner_up_share = winner_share - (2.0 + rMargin * 12.0);
  if (runner_up_share < 20.0) runner_up_share = 22.0;

  const winner_votes    = Math.floor(total_voted * (winner_share / 100));
  const runner_up_votes = Math.floor(total_voted * (runner_up_share / 100));
  const margin          = winner_votes - runner_up_votes;
  const nota_votes      = Math.floor(total_voted * (0.002 + rNota * 0.005));

  const is_vote_split = (winner_party === "TVK" && seededRandom(nameSeed + 'split') < 0.42);
  let vote_split_details = null;
  if (is_vote_split) {
    const dmk_pct    = parseFloat((runner_up_party === "DMK"    ? runner_up_share : (100 - winner_share - runner_up_share) * 0.6).toFixed(2));
    const aiadmk_pct = parseFloat((runner_up_party === "AIADMK" ? runner_up_share : (100 - winner_share - runner_up_share) * 0.4).toFixed(2));
    vote_split_details = {
      tvk_pct: parseFloat(winner_share.toFixed(2)),
      dmk_pct, aiadmk_pct,
      combined_opp_pct: parseFloat((dmk_pct + aiadmk_pct).toFixed(2))
    };
  }

  const is_cabinet_member  = false;
  const cabinet_designation = "";

  const regMapped = {
    "North":   { en: "North",   ta: "வடக்கு" },
    "South":   { en: "South",   ta: "தெற்கு" },
    "Central": { en: "Central", ta: "மத்திய" },
    "West":    { en: "West",    ta: "மேற்கு" }
  }[info.region];

  return {
    id, name: currentLang === 'en' ? info.name.en : info.name.ta,
    ac_no: info.ac_no,
    district: currentLang === 'en' ? info.district.en : info.district.ta,
    region:   currentLang === 'en' ? regMapped.en    : regMapped.ta,
    reserved: currentLang === 'en' ? info.reserved.en : info.reserved.ta,
    winner_name: is_cabinet_member
      ? (currentLang === 'en' ? is_cab.Name.en : is_cab.Name.ta)
      : (currentLang === 'en' ? `Candidate A (${winner_party})` : `வேட்பாளர் அ (${winner_party})`),
    winner_party, runner_up_party,
    runner_up_name: currentLang === 'en' ? `Candidate B (${runner_up_party})` : `வேட்பாளர் ஆ (${runner_up_party})`,
    winner_votes, runner_up_votes, margin,
    total_votes: total_voted, turnout_pct,
    electors_male, electors_female, electors_tg: 20, electors_total,
    voted_male, voted_female, voted_tg,
    postal_votes: Math.floor(1000 + rTurnout * 1800),
    nota_votes,
    is_postal_flip: false, is_vote_split, vote_split_details,
    is_cabinet_member, cabinet_designation
  };
}

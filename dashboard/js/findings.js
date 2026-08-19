/* =============================================================
   findings.js — Dynamic findings data loader with client-side fallback
   ============================================================= */

let FINDINGS_DATA = [];

const FINDINGS_FALLBACK = [
  {
    "id": "01",
    "categoryEn": "Gender Voter Turnout",
    "categoryTa": "பாலின வாக்குப்பதிவு",
    "keyNumber": "169 Seats",
    "keyNumberTa": "169 தொகுதிகள்",
    "titleEn": "Women Outvoted Men Across Tamil Nadu",
    "titleTa": "தமிழகத்தின் பெரும்பாலான தொகுதிகளில் பெண்கள் அதிக வாக்குப்பதிவு",
    "summaryEn": "Female turnout surpassed male participation in 169 of 234 constituencies, recording an 86.20% statewide turnout against 83.77% for men—revealing a consistent gender participation advantage across the state.",
    "summaryTa": "234 தொகுதிகளில் 169 தொகுதிகளில் பெண்களின் வாக்குப்பதிவு ஆண்களை விட அதிகமாக இருந்தது. மாநில அளவில் பெண்களின் வாக்குப்பதிவு 86.20%, ஆண்கள் 83.77% மட்டுமே."
  },
  {
    "id": "02",
    "categoryEn": "FPTP & Party Mandate",
    "categoryTa": "தேர்தல் முறைமை மற்றும் பலம்",
    "keyNumber": "108 Seats",
    "keyNumberTa": "108 இடங்கள்",
    "titleEn": "TVK Won the Seats, Not the Votes",
    "titleTa": "தவெக இடங்களைக் கைப்பற்றியது, வாக்குகளை அல்ல",
    "summaryEn": "How First-Past-The-Post converted TVK's 35.07% vote share into 108 seats (46.15% seat share), analyzing conversion mechanics across all parties.",
    "summaryTa": "ஃபர்ஸ்ட்-பாஸ்ட்-தி-போஸ்ட் முறைமை எவ்வாறு தவெகவின் 35.07% வாக்குகளை 108 சட்டமன்ற இடங்களாக மாற்றியது என்பதன் முழுமையான பகுப்பாய்வு."
  },
  {
    "id": "03",
    "categoryEn": "Voter Discontent & NOTA",
    "categoryTa": "நோட்டா மற்றும் வாக்காளர் அதிருப்தி",
    "keyNumber": "199,801 Votes",
    "keyNumberTa": "1,99,801 வாக்குகள்",
    "titleEn": "The NOTA Vote Footprint",
    "titleTa": "நோட்டா வாக்குகளின் தாக்கம்",
    "summaryEn": "Across 234 assembly seats, 199,801 voters chose NOTA (0.41% avg). In 11 constituencies, NOTA votes exceeded the winning margin.",
    "summaryTa": "தமிழகத்தில் 1,99,801 வாக்காளர்கள் நோட்டாவிற்கு வாக்களித்தனர். 11 தொகுதிகளில் வெற்றி வித்தியாசத்தை விட நோட்டா வாக்குகள் அதிகமாக இருந்தன."
  },
  {
    "id": "04",
    "categoryEn": "Candidate Deposit Loss",
    "categoryTa": "தேர்தல் வைப்புத் தொகை",
    "keyNumber": "83.32%",
    "keyNumberTa": "83.32%",
    "titleEn": "The Price of Contesting",
    "titleTa": "போட்டியிடுவதன் விலை: வைப்புத் தொகை இழப்பு",
    "summaryEn": "3,352 of 4,023 contesting candidates (83.32%) lost their security deposit; 3.8 million votes went to no-hope candidates.",
    "summaryTa": "போட்டியிட்ட 4,023 வேட்பாளர்களில் 3,352 பேர் (83.32%) வைப்புத் தொகையை இழந்தனர். 38 லட்சம் வாக்குகள் வீணாகின."
  },
  {
    "id": "05",
    "categoryEn": "The Reserved Mandate",
    "categoryTa": "தனித்தொகுதித் தீர்ப்பு",
    "keyNumber": "46 Reserved Seats",
    "keyNumberTa": "46 தனித்தொகுதிகள்",
    "titleEn": "THE RESERVED MANDATE: Competition & Representation",
    "titleTa": "தனித்தொகுதித் தீர்ப்பு: முழுமையான பகுப்பாய்வு",
    "summaryEn": "A comprehensive reference study across Tamil Nadu's 46 reserved seats (44 SC, 2 ST). SC seats recorded tighter winning margins (14,192 vs 17,544 in General), while TVK captured 23 of 44 SC seats (52.3%).",
    "summaryTa": "46 எஸ்சி/எஸ்டி தனித்தொகுதிகளில் போட்டித்தன்மை, பிரதிநிதித்துவம் மற்றும் தவெகவின் 23 இடங்கள் (52.3%) வெற்றி குறித்த முழுமையான பகுப்பாய்வு."
  },
  {
    "id": "06",
    "categoryEn": "Razor-Thin Contests",
    "categoryTa": "மிக நெருக்கமான போட்டிகள்",
    "keyNumber": "1 Vote",
    "keyNumberTa": "1 வாக்கு",
    "titleEn": "The One-Vote Election: Tiruppattur",
    "titleTa": "ஒரு வாக்கு வெற்றி: திருப்பத்தூர் வழக்கு ஆய்வு",
    "summaryEn": "TVK's 819-vote EVM lead in Tiruppattur was nearly erased by DMK's 818 postal votes, sealing a 1-vote certified victory.",
    "summaryTa": "திருப்பத்தூரில் எலெக்ட்ரானிக் வாக்குகளின் 819 வாக்கு வித்தியாசத்தை தபால் வாக்குகள் குறைத்து 1 வாக்கு வெற்றியாக மாற்றின."
  },
  {
    "id": "07",
    "categoryEn": "Statewide Voter Turnout",
    "categoryTa": "மாநில வரலாற்று வாக்குப்பதிவு",
    "keyNumber": "86.03%",
    "keyNumberTa": "86.03%",
    "titleEn": "When Tamil Nadu Voted Like Never Before",
    "titleTa": "தமிழகம் இதுவரை காணாத வரலாற்றுச் சாதனை வாக்குப்பதிவு",
    "summaryEn": "Tamil Nadu recorded an all-time record certified turnout of 86.03%, with 49,389,958 votes polled out of 57,411,793 electors.",
    "summaryTa": "தமிழகத்தின் 5.74 கோடி வாக்காளர்களில் 4.93 கோடி பேர் வாக்களித்து 86.03% வரலாற்று சாதனை வாக்குப்பதிவை ஏற்படுத்தினர்."
  },
  {
    "id": "08",
    "categoryEn": "District Geography",
    "categoryTa": "மாவட்ட புவியியல் வெற்றி",
    "keyNumber": "30 Districts",
    "keyNumberTa": "30 மாவட்டங்கள்",
    "titleEn": "The Geography of Victory",
    "titleTa": "வெற்றியின் புவியியல் வரைபடம்",
    "summaryEn": "TVK won seats across 30 of Tamil Nadu's 38 districts, capturing 108 total seats led by a 16-seat clean sweep in Chennai.",
    "summaryTa": "தமிழகத்தின் 38 மாவட்டங்களில் 30 மாவட்டங்களில் தவெக 108 இடங்களை வென்று தன் ஆதிக்கத்தைப் பதிவு செய்துள்ளது."
  },
  {
    "id": "09",
    "categoryEn": "Regional Strengths",
    "categoryTa": "பிராந்திய கூட்டணி பலம்",
    "keyNumber": "59 Seats",
    "keyNumberTa": "59 இடங்கள்",
    "titleEn": "The Battlegrounds of Tamil Nadu",
    "titleTa": "தமிழகத்தின் தேர்தல் போர்க்களங்கள்",
    "summaryEn": "Detailed regional breakdowns showing AIADMK's 59-seat western belt concentration and alliance performance across all major zones.",
    "summaryTa": "கொங்கு மண்டலம் உட்பட தமிழகத்தின் பல்வேறு மண்டலங்களில் கூட்டணிகளின் வெற்றி மற்றும் பலம் குறித்த பகுப்பாய்வு."
  },
  {
    "id": "10",
    "categoryEn": "Upcoming Special Finding",
    "categoryTa": "புதிய ஆய்வு அறிக்கை",
    "keyNumber": "Finding #10",
    "keyNumberTa": "கண்டுபிடிப்பு #10",
    "titleEn": "Finding #10: Upcoming Analytical Feature",
    "titleTa": "கண்டுபிடிப்பு #10: புதிய தேர்தல் பகுப்பாய்வு",
    "summaryEn": "Placeholder for upcoming new analytical investigation and research story.",
    "summaryTa": "புதிய சிறப்பு தேர்தல் ஆய்வு கட்டுரைக்கான இடம்."
  },
  {
    "id": "11",
    "categoryEn": "Electoral Realignment",
    "categoryTa": "அரசியல் மறுசீரமைப்பு",
    "keyNumber": "70.94%",
    "keyNumberTa": "70.94%",
    "titleEn": "The Great Political Realignment",
    "titleTa": "பெரும் அரசியல் மறுசீரமைப்பு",
    "summaryEn": "166 out of 234 assembly seats (70.94%) changed winning party hands between 2021 and 2026, documenting massive structural volatility.",
    "summaryTa": "234 தொகுதிகளில் 166 தொகுதிகள் (70.94%) 2021-ஐ விட 2026-ல் வேறுபட்ட அரசியல் கட்சியைத் தேர்ந்தெடுத்துள்ளன."
  },
  {
    "id": "12",
    "categoryEn": "Third-Party Impact",
    "categoryTa": "மூன்றாம் தரப்பு தாக்கம்",
    "keyNumber": "89 Seats",
    "keyNumberTa": "89 இடங்கள்",
    "titleEn": "The Kingmaker Effect",
    "titleTa": "கிங்மேக்கர் தாக்கம்",
    "summaryEn": "NTK's certified vote totals exceeded the winning margin in 89 of 234 assembly constituencies (38.03%), demonstrating a major numerical footprint.",
    "summaryTa": "89 தொகுதிகளில் (38.03%) நாம் தமிழர் கட்சியின் வாக்குகள் வெற்றி வித்தியாசத்தை விட அதிகமாக இருந்தன."
  },
  {
    "id": "13",
    "categoryEn": "Demographic Shift",
    "categoryTa": "சட்டமன்ற தலைமுறை மாற்றம்",
    "keyNumber": "45.0 Years",
    "keyNumberTa": "45.0 வயது",
    "titleEn": "The Generational Shift",
    "titleTa": "சட்டமன்றத் தலைமுறை மாற்றம்",
    "summaryEn": "TVK entered the Assembly with the youngest delegation averaging 45.0 years (34.26% under 40), led by youngest MLA Kamali S. (age 28).",
    "summaryTa": "தவெக சட்டமன்ற உறுப்பினர்களின் சராசரி வயது 45.0 ஆக இருந்தது. இளம் எம்.எல்.ஏ கமலி எஸ். 28 வயதில் வெற்றி பெற்றார்."
  },
  {
    "id": "14",
    "categoryEn": "Executive Mandate",
    "categoryTa": "அமைச்சரவையின் வாக்கு பலம்",
    "keyNumber": "21,531 Margin",
    "keyNumberTa": "21,531 வாக்கு விளிம்பு",
    "titleEn": "The Cabinet Mandate",
    "titleTa": "அமைச்சரவையின் வெற்றி வாக்குகள்",
    "summaryEn": "Appointed cabinet ministers won by an average margin of 21,531 votes (+28.3% vs statewide baseline of 16,784), though 6 won by under 5,000 votes.",
    "summaryTa": "அமைச்சர்களின் சராசரி வெற்றி வித்தியாசம் 21,531 வாக்குகளாக இருந்தது. 6 அமைச்சர்கள் 5,000க்கும் குறைவான வித்தியாசத்தில் வென்றனர்."
  },
  {
    "id": "15",
    "categoryEn": "Gender Representation",
    "categoryTa": "பெண்கள் பிரதிநிதித்துவம்",
    "keyNumber": "9.83% (23 Women)",
    "keyNumberTa": "9.83% (23 பெண்கள்)",
    "titleEn": "Women in the Assembly",
    "titleTa": "சட்டமன்றத்தில் பெண்கள்",
    "summaryEn": "Only 23 of 234 MLAs (9.83%) are women (TVK 13, AIADMK 6). Female MLAs averaged 46.3 years and a narrower turnout gap (1.54 pts vs 2.42 pts).",
    "summaryTa": "234 உறுப்பினர்களில் 23 பெண்கள் (தவெக 13, அதிமுக 6). பெண் உறுப்பினர்கள் சராசரி 46.3 வயதில் சமமான வெற்றி வித்தியாசத்தைப் பெற்றனர்."
  }
];

async function loadFindingsData() {
  try {
    const res = await fetch('/api/findings');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        FINDINGS_DATA = data;
        return FINDINGS_DATA;
      }
    }
  } catch (err) {
    // Expected fallback when endpoint is static
  }

  FINDINGS_DATA = FINDINGS_FALLBACK;
  return FINDINGS_DATA;
}

function createFindingCardHtml(f, lang) {
  const fid = f.id;
  const cat = lang === 'ta' ? (f.categoryTa || f.categoryEn) : f.categoryEn;
  const title = lang === 'ta' ? (f.titleTa || f.titleEn) : f.titleEn;
  const summary = lang === 'ta' ? (f.summaryTa || f.summaryEn) : f.summaryEn;
  const keyNum = lang === 'ta' ? (f.keyNumberTa || f.keyNumber) : f.keyNumber;
  const linkUrl = `findings/finding_${fid}.html?lang=${lang}`;

  return `
    <article class="finding-card">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-family:'Courier Prime',monospace; font-size:10px; text-transform:uppercase; color:var(--ink-gray); font-weight:bold;">${cat}</span>
          <span style="font-family:'Courier Prime',monospace; font-size:9.5px; background:var(--ink-charcoal); color:#ffffff; padding:2px 6px; border-radius:2px; font-weight:bold;">FINDING #${fid}</span>
        </div>
        <h3 class="finding-headline">
          <a href="${linkUrl}" style="color:inherit; text-decoration:none;">${title}</a>
        </h3>
        <span class="finding-number">${keyNum}</span>
        <p class="finding-summary">${summary}</p>
      </div>
      <div style="margin-top:12px;">
        <a href="${linkUrl}" class="finding-link">
          ${lang === 'ta' ? 'மேலும் படிக்க' : 'Read More'} &rarr;
        </a>
      </div>
    </article>
  `;
}

function renderFindingsCards(containerId, lang = 'en') {
  const currentL = (typeof containerId === 'string' && (containerId === 'en' || containerId === 'ta')) ? containerId : (lang || 'en');
  const container = document.getElementById("findingsGrid") || (typeof containerId === 'string' && document.getElementById(containerId));
  if (!container) return;

  const list = FINDINGS_DATA.length > 0 ? FINDINGS_DATA : FINDINGS_FALLBACK;
  // Filter out first 6 findings as requested (they appear in the top hero/sidebar)
  const remainingList = list.filter(f => parseInt(f.id, 10) > 6);
  container.innerHTML = '';

  remainingList.forEach(f => {
    container.innerHTML += createFindingCardHtml(f, currentL);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadFindingsData();
  const lang = window.currentLang || 'en';
  if (typeof renderDynamicFrontPage === 'function') renderDynamicFrontPage(lang);
  renderFindingsCards(lang);
});

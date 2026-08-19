/* =============================================================
   core.js — Language, Translations, Tab Navigation
   ============================================================= */

let currentLang = 'en';

window.PARTY_FLAG_FILE_MAP = {
  "TVK": "img/flag_tvk.png",
  "DMK": "img/flag_dmk.png",
  "AIADMK": "img/flag_aiadmk.png",
  "ADMK": "img/flag_aiadmk.png",
  "INC": "img/flag_inc.png",
  "BJP": "img/flag_bjp.png",
  "VCK": "img/flag_vck.png",
  "CPI": "img/flag_cpi.png",
  "CPI(M)": "img/flag_cpim.png",
  "CPI-M": "img/flag_cpim.png",
  "CPIM": "img/flag_cpim.png",
  "PMK": "img/flag_pmk.png",
  "IUML": "img/flag_iuml.png",
  "DMDK": "img/flag_dmdk.png",
  "AMMK": "img/flag_ammk.png"
};

function getPartyFlagHtml(party, extraStyle) {
  if (!party) return '';
  const p = party.trim().toUpperCase();
  const file = window.PARTY_FLAG_FILE_MAP[p] || window.PARTY_FLAG_FILE_MAP[party.trim()];
  if (file) {
    const style = extraStyle || "width:16px; height:10px; object-fit:cover; border:1px solid rgba(255,255,255,0.3); display:inline-block; vertical-align:middle; margin-right:4px;";
    return `<img src="${file}" alt="${party}" style="${style}" onerror="this.style.display='none'">`;
  }
  return '';
}

async function loadBQPartyWinners() {
  try {
    const res = await fetch('/api/party-winners');
    if (res.ok) {
      window.BQ_PARTY_WINNERS = await res.json();
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn("[Core] Could not fetch party-winners API, loading default party winners fallback:", err);
    window.BQ_PARTY_WINNERS = [
      {"party_code": "TVK", "party_full": "Tamilaga Vettri Kazhagam", "seats_won": 108},
      {"party_code": "DMK", "party_full": "Dravida Munnetra Kazhagam", "seats_won": 59},
      {"party_code": "AIADMK", "party_full": "All India Anna Dravida Munnetra Kazhagam", "seats_won": 47},
      {"party_code": "INC", "party_full": "Indian National Congress", "seats_won": 5},
      {"party_code": "PMK", "party_full": "Pattali Makkal Katchi", "seats_won": 4},
      {"party_code": "IUML", "party_full": "Indian Union Muslim League", "seats_won": 2},
      {"party_code": "CPI", "party_full": "Communist Party of India", "seats_won": 2},
      {"party_code": "VCK", "party_full": "Viduthalai Chiruthaigal Katchi", "seats_won": 2},
      {"party_code": "CPI(M)", "party_full": "Communist Party of India (Marxist)", "seats_won": 2},
      {"party_code": "BJP", "party_full": "Bharatiya Janata Party", "seats_won": 1},
      {"party_code": "DMDK", "party_full": "Desiya Murpokku Dravida Kazhagam", "seats_won": 1},
      {"party_code": "AMMK", "party_full": "Amma Makkal Munnettra Kazagam", "seats_won": 1}
    ];
  } finally {
    if (typeof renderDynamicFrontPage === 'function' && typeof currentLang !== 'undefined') {
      renderDynamicFrontPage(currentLang);
    }
  }
}


/* Seeded random generator (deterministic mock data) */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

/* Translation dictionary */
const TRANSLATIONS = {
  "masthead_motto": { en: "Recording the People's Verdict", ta: "மக்களின் தீர்ப்பை தரவாகப் பதிவு செய்கிறோம்" },
  "masthead_title": { en: "The People's Ledger", ta: "மக்கள் பதிவேடு" },
  "masthead_dateline_issue": { en: "VOL. LXXVI · ISSUE 234", ta: "தொகுதி LXXVI · இதழ் 234" },
  "masthead_dateline_price": { en: "PRICE: ANNA ONE (FREE ARCHIVE)", ta: "விலை: ஒரு அணா (காப்பக இதழ்)" },
  "masthead_banner": { en: "✦ SPECIAL CONSTITUENCY ARCHIVE & ELECTORAL REVIEW ✦", ta: "✦ தொகுதி வாரியான தேர்தல் முடிவுகள் மற்றும் ஆய்வறிக்கை சிறப்பு இதழ் ✦" },
  "quick_tallies": { en: "Official Returns", ta: "அதிகாரப்பூர்வ முடிவுகள்" },
  "quick_tallies_subtitle": { en: "Final Count", ta: "இறுதி எண்ணிக்கை" },
  "total_assembly_seats": { en: "Total Assembly Seats", ta: "மொத்த சட்டமன்றத் தொகுதிகள்" },
  "majority_mark": { en: "Majority Mark Required", ta: "பெரும்பான்மை பெற தேவை" },
  "majority_sub": { en: "50% + 1 Seat", ta: "50% + 1 இடம்" },
  "average_turnout": { en: "Statewide Turnout", ta: "மாநில வாக்குப்பதிவு" },
  "statewide_seats": { en: "Party Candidates Won", ta: "கட்சி வாரியாக வென்ற இடங்கள்" },
  "col_party": { en: "Party Name", ta: "கட்சியின் பெயர்" },
  "col_seats": { en: "Seats", ta: "இடங்கள்" },
  "col_share": { en: "Share", ta: "வாக்கு சதவீதம்" },
  "chamber_layout": { en: "Chamber Layout (234 Seats)", ta: "அவை இருக்கை அமைப்பு (234 இடங்கள்)" },
  "lead_story_sec_head": { en: "Statewide Lead Story", ta: "மாநில செய்தித் தலைப்பு" },
  "lead_story_sec_sub": { en: "Electoral Math", ta: "தேர்தல் கணிதம்" },
  "lead_story_headline": { en: "THE VOTE-SPLIT REVELATION: ALLIANCE WINS SEATS, NOT POPULAR VOTE", ta: "வாக்கு சிதறலின் உண்மை: மக்கள் ஆதரவல்ல, வாக்கு பிரிவினையே வெற்றியின் காரணம்!" },
  "lead_story_byline": { en: "By Our Chief Analytics Correspondent · Data Investigations Unit", ta: "எங்கள் தலைமை பகுப்பாய்வு நிருபர் · தரவு விசாரணைப் பிரிவு" },
  "lead_story_body_1": { en: "A granular mathematical investigation of the final election returns across Tamil Nadu's 234 assembly constituencies has revealed a striking democratic truth. The newly formed Tamilizhaga Vettri Kazhagam (TVK) alliance has emerged as the largest bloc in the legislative assembly, capturing 107 seats. However, analysis of the underlying vote shares indicates this victory was paved by a deep division in opposition votes, rather than a singular popular mandate.", ta: "தமிழ்நாட்டின் 234 சட்டமன்றத் தொகுதிகளின் இறுதித் தேர்தல் முடிவுகள் குறித்த விரிவான கணிதப் பகுப்பாய்வு ஒரு வியக்கத்தக்க ஜனநாயாக உண்மையை வெளிப்படுத்தியுள்ளது." },
  "lead_story_body_2": { en: "Statewide, the Dravida Munnetra Kazhagam (DMK) alliance secured 24.19% of all votes cast, while the All India Anna Dravida Munnetra Kazhagam (AIADMK) alliance secured 21.21%. Combined, these two established forces captured 45.40% of the popular vote—outpolling TVK's statewide share of 34.92% by more than ten percentage points.", ta: "மாநில அளவில், திமுக கூட்டணி 24.19% வாக்குகளையும், அதிமுக கூட்டணி 21.21% வாக்குகளையும் பெற்றன." },
  "lead_story_body_3": { en: "At the seat level, this vote split had decisive consequences. In exactly 45 of TVK's 107 victorious seats (42%), the DMK and AIADMK candidates combined received more votes than the winning TVK candidate.", ta: "தொகுதி அளவில், இந்த வாக்கு பிரிவினை மிகத் தீர்க்கமான விளைவுகளை ஏற்படுத்தியது." },
  "lead_story_pullquote": { en: "\"In 45 of TVK's 107 wins, the combined vote shares of the runners-up surpassed the winner's total. Vote division, not majoritarian popularity, decided the government.\"", ta: "\"டிவிகே வென்ற 107 தொகுதிகளில் 45-ல், இரண்டாம் இடம் பெற்றவர்களின் கூட்டு வாக்கு சதவீதம் வெற்றியாளரை விட அதிகமாக இருந்தது.\"" },
  "lead_story_pullquote_caption": { en: "Electoral Analysis Section · Figure IV-B", ta: "தேர்தல் பகுப்பாய்வு பிரிவு · படம் IV-B" },
  "lead_story_body_4": { en: "As a prime example, the constituency of <strong>Gummidipoondi (AC 001)</strong> saw TVK capture the seat with 40.56% of the vote. Yet DMK polled 26.88% and AIADMK polled 28.55%, meaning TVK won despite a clear majority of voters backing their competitors.", ta: "இதற்குச் சிறந்த உதாரணமாக, <strong>கும்மிடிப்பூண்டி (ஏசி 001)</strong> தொகுதியில் டிவிகே 40.56% வாக்குகள் பெற்று வெற்றி பெற்றது." },
  "gender_title": { en: "Gender Turnout Gap", ta: "பாலின வாக்குப்பதிவு இடைவெளி" },
  "gender_headline": { en: "WOMEN LEAD VOTER TURNOUT IN 165 SEATS", ta: "165 தொகுதிகளில் பெண்கள் அதிகளவில் வாக்குப்பதிவு!" },
  "gender_body": { en: "The female electorate registered a significantly higher voter turnout percentage than their male counterparts in 165 out of 234 seats (approximately 70% of the state). The statewide average gap stands at <strong>+2.33 percentage points</strong> in favor of women.", ta: "மாநிலத்தின் 234 தொகுதிகளில் 165 தொகுதிகளில் பெண் வாக்காளர்கள் அதிக வாக்குப்பதிவு சதவீதத்தைப் பதிவு செய்துள்ளனர். சராசரி இடைவெளி <strong>+2.33 சதவீத புள்ளிகளாக</strong> உள்ளது." },
  "nota_title": { en: "Dissatisfaction Indexes", ta: "அதிருப்தி குறிகாட்டிகள்" },
  "nota_headline": { en: "NOTA DISCONTENT HOTSPOTS IDENTIFIED", ta: "நோட்டா அதிருப்தி அதிகமாக பதிவான தொகுதிகள்" },
  "nota_body": { en: "While the statewide average for NOTA remained low at 0.41%, certain pockets recorded notable spikes. The highest NOTA share was documented in <strong>Udhagamandalam</strong> at 1.04%.", ta: "மாநில சராசரி நோட்டா 0.41% ஆகக் குறைவாக இருந்தாலும், சில பகுதிகளில் அதிருப்தி காணப்படுகிறது. <strong>உதகமண்டலம்</strong> தொகுதியில் 1.04% நோட்டா பதிவானது." },
  "select_district_label": { en: "Select District", ta: "மாவட்டங்களைத் தேர்ந்தெடுக்கவும்" },
  "select_constituency": { en: "Constituency Electoral Archive Lookup", ta: "தொகுதி தேர்தல் முடிவுகள் காப்பகத் தேடல்" },
  "select_constituency_label": { en: "Select Constituency Name", ta: "தொகுதியின் பெயரைத் தேர்வுசெய்யவும்" },
  "or_type_search": { en: "Or Type to Search All 234 Seats", ta: "அல்லது நேரடியாகத் தட்டச்சு செய்து தேடவும்" },
  "district_map_view": { en: "District Map View", ta: "வரைபடக் காட்சி" },
  "district_map_sub": { en: "Interactive boundaries centered on Madras Presidency divisions. Filtered to sepia newsprint.", ta: "மாநிலப் பிரிவுகளின் அடிப்படையில் அமைந்த வரைபடம்." },
  "select_assembly_division": { en: "Select Assembly Division", ta: "சட்டமன்றப் பிரிவைத் தேர்வுசெய்யவும்" },
  "svg_region_prompt": { en: "<strong>Click a region</strong> on the map engraving above to view regional seat counts and average turnout patterns.", ta: "மாநிலப் பகுதிகளின் இருக்கை எண்ணிக்கையை அறிய மேலே உள்ள வரைபடத்தில் <strong>ஏதேனும் ஒரு பகுதியை அழுத்தவும்</strong>." },
  "district_ledger": { en: "Statewide Voter Archives", ta: "மாநில வாக்காளர் ஆவணங்கள்" },
  "district_ledger_sub": { en: "Official 2026 Turnout Ledger", ta: "அதிகாரப்பூர்வ 2026 வாக்குப்பதிவுப் பதிவேடு" },
  "voter_archives_headline": { en: "DEMOCRATIC RECORD: FEMALE ELECTORS OUTVOTE MALES", ta: "ஜனநாயகப் பதிவு: பெண் வாக்காளர்களின் வாக்குப்பதிவு அதிகம்" },
  "voter_archives_byline": { en: "Compiled by the ECI Records Registry · Special Report", ta: "இந்திய தேர்தல் ஆணைய ஆவணக் காப்பகம் தொகுத்தது · சிறப்பு அறிக்கை" },
  "voter_archives_desc": { en: "Of Tamil Nadu's 234 assembly seats, women turned out to vote at higher percentages in 165 seats (≈70%). The tables below document the stark regional contrasts.", ta: "தமிழ்நாட்டின் 234 தொகுதிகளில், 165 தொகுதிகளில் (≈70%) பெண்கள் அதிக சதவீதத்தில் வாக்களித்துள்ளனர்." },
  "top_5_female_gap": { en: "Top 5 Female Turnout Advantages", ta: "பெண்களின் கூடுதல் வாக்குப்பதிவு அதிகம் உள்ள சிறந்த 5 மாவட்டங்கள்" },
  "bottom_5_female_gap": { en: "Lowest / Reversed Turnout Gaps", ta: "குறைந்த / ஆண்கள் கூடுதல் வாக்குப்பதிவு உள்ள 5 மாவட்டங்கள்" },
  "col_district": { en: "District Name", ta: "மாவட்டத்தின் பெயர்" },
  "col_region": { en: "Region", ta: "மண்டலம்" },
  "col_gap": { en: "Female Advantage", ta: "பெண்களின் கூடுதல் வாக்குப்பதிவு" },
  "district_ledger_title": { en: "District ECI Ledger", ta: "மாவட்ட தேர்தல் பதிவேடு" },
  "click_to_sort": { en: "Click headers to sort", ta: "வரிசைப்படுத்த தலைப்புகளை அழுத்தவும்" },
  "district_ledger_sub_guide": { en: "Summarized ECI register for districts. Showing electors and comparative turnout details.", ta: "மாவட்ட வாரியான சுருக்க தேர்தல் பதிவேடு." },
  "stats_sec_head": { en: "Electoral Research & Statistical Division", ta: "தேர்தல் ஆராய்ச்சி & புள்ளிவிவரப் பிரிவு" },
  "stats_sec_sub": { en: "Technical Review", ta: "தொழில்நுட்ப ஆய்வு" },
  "stats_main_head": { en: "STATISTICAL DISTRIBUTIONS & MARGINAL COMPARISONS", ta: "புள்ளிவிவரப் பகிர்வுகள் & வாக்கு வித்தியாசம் குறித்த ஆய்வுகள்" },
  "stats_main_sub": { en: "The records below detail the competitive breakdown of the election, including margin frequencies across all 234 seats, performance discrepancies inside reserved blocks (SC/ST), and the singular impact of postal returns.", ta: "கீழேயுள்ள பதிவுகள் அனைத்து 234 தொகுதிகளின் வாக்கு வித்தியாச அதிர்வெண்கள் மற்றும் தனித்தொகுதிகளின் ஒப்பீடுகளை விளக்குகின்றன." },
  "reserved_title": { en: "Reserved Seat Competitiveness", ta: "தனித்தொகுதிகளின் போட்டித் தன்மை" },
  "reserved_body": { en: "Tamil Nadu sets aside 44 seats for Scheduled Castes (SC) and 2 seats for Scheduled Tribes (ST). Data indicates that reserved seats were substantially more competitive on average.<br><br>While General seats returned an average winning margin of <strong>17,544 votes</strong>, SC seats had a tighter average of <strong>14,192 votes</strong>. ST seats returned an ultra-competitive average of just <strong>2,422 votes</strong>.", ta: "தமிழ்நாடு SC க்கு 44 மற்றும் ST க்கு 2 இடங்களை ஒதுக்கியுள்ளது. பொதுத் தொகுதி சராசரி வித்தியாசம் <strong>17,544</strong>, SC சராசரி <strong>14,192</strong>, ST சராசரி <strong>2,422</strong> வாக்குகள்." },
  "postal_title": { en: "The Postal Decided Race — Tiruppattur", ta: "தபால் வாக்குகளால் மாறிய முடிவு — திருப்பத்தூர்" },
  "postal_body": { en: "Across the entire state, only one single constituency would have returned a different winner without postal ballot returns.", ta: "தமிழ்நாட்டில் தபால் வாக்குகளால் முடிவு மாறிய ஒரே தொகுதி திருப்பத்தூர்." },
  "map_sec_head": { en: "Electoral Cartography Division", ta: "தேர்தல் வரைபட பிரிவு" },
  "map_sec_sub": { en: "Statewide Geographic Review", ta: "மாநில புவியியல் ஆய்வு" },
  "map_main_head": { en: "TAMIL NADU CONSTITUENCY MAP EXPLORER", ta: "தமிழ்நாடு தொகுதி வரைபட ஆய்வாளர்" },
  "map_main_sub": { en: "This geographical review maps all 234 assembly constituencies, colored by their winning alliance. Hover over any constituency to view candidate tallies, votes, and margins.", ta: "இந்த புவியியல் ஆய்வு 234 தொகுதிகளை வரைபடமாக காட்டுகிறது. வெற்றி பெற்ற கூட்டணியின் நிறத்தில் வண்ணமிடப்பட்டுள்ளது." },
  "legend_tvk": { en: "TVK Coalition", ta: "டிவிகே கூட்டணி" },
  "legend_dmk": { en: "DMK Alliance (DMK+)", ta: "திமுக கூட்டணி (திமுக+)" },
  "legend_admk": { en: "AIADMK Alliance (ADMK+)", ta: "அதிமுக கூட்டணி (அதிமுக+)" },
  "legend_others": { en: "Others", ta: "மற்றவர்கள்" },
  "hover_party": { en: "Party", ta: "கட்சி" },
  "hover_alliance": { en: "Alliance", ta: "கூட்டணி" },
  "hover_votes": { en: "Votes", ta: "வாக்குகள்" },
  "hover_margin": { en: "Margin", ta: "வாக்கு வித்தியாசம்" },
  "footer_title": { en: "THE PEOPLE'S LEDGER ARCHIVE · RE-CONSTRUCTED FOR PORTFOLIO REVIEWS", ta: "மக்கள் பதிவேடு காப்பகம் · போர்ட்ஃபோலியோ மதிப்பாய்விற்காக மறுகட்டமைக்கப்பட்டது" },
  "footer_disclaimer": { en: "Disclaimer: This is an old-newspaper themed data representation dashboard utilizing genuine Tamil Nadu 2026 assembly election returns. All findings verified.", ta: "பொறுப்புத் துறப்பு: இது தமிழ்நாட்டின் 2026 சட்டமன்றத் தேர்தல் முடிவுகளை அடிப்படையாகக் கொண்ட பழைய செய்தித்தாள் வடிவிலான தேர்தல் முடிவுகள் காப்பகப் பதிப்பாகும்." },
  "findings_section_title": { en: "SPECIAL INVESTIGATION ARCHIVE: FINDINGS 07 - 15", ta: "சிறப்பு ஆய்வு ஆவணக் காப்பகம்: அறிக்கைகள் 07 - 15" },
  "findings_section_subtitle": { en: "Demographic, Regional & Mandate Analysis", ta: "மக்கள் தொகை, பிராந்தியம் மற்றும் வாக்கு பலப்பகுப்பாய்வு" },
  "findings_top_section_title": { en: "PRIMARY INVESTIGATIONS: TOP 6 FINDINGS", ta: "முக்கியத் தேர்தல் ஆய்வுகள்: முதல் 6 அறிக்கைகள்" },
  "findings_top_section_subtitle": { en: "Core Electoral Data Dossiers", ta: "முக்கியத் தேர்தல் தரவு ஆவணங்கள்" },
  "findings_bottom_section_title": { en: "SPECIAL INVESTIGATION ARCHIVE: FINDINGS 07 - 15", ta: "சிறப்பு ஆய்வு ஆவணக் காப்பகம்: அறிக்கைகள் 07 - 15" },
  "findings_bottom_section_subtitle": { en: "Demographic, Regional & Mandate Analysis", ta: "மக்கள் தொகை, பிராந்தியம் மற்றும் வாக்கு பலப்பகுப்பாய்வு" },
  "vacant_section_title": { en: "GAZETTE NOTICE: 7 VACANT ASSEMBLY CONSTITUENCIES", ta: "அரசிதழ் அறிவிப்பு: 7 காலியாக உள்ள சட்டமன்றத் தொகுதிகள்" },
  "vacant_section_subtitle": { en: "By-Elections Pending | Party Tally Impact: AIADMK (-6), TVK (-1)", ta: "இடைத்தேர்தல் நிலுவை | கட்சி இடங்கள் மாற்றம்: அதிமுக (-6), தவெக (-1)" }
};

/* Language overlay handler */
function chooseLanguage(lang) {
  currentLang = lang;
  const overlay = document.getElementById('langOverlay');
  overlay.style.opacity = 0;
  setTimeout(() => {
    overlay.style.display = "none";
    document.getElementById('mainContainer').style.display = "block";
    setLanguage(lang);
    if (leafletMap) leafletMap.invalidateSize();
  }, 400);
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'ta' : 'en');
}

/* Full bilingual re-render */
function setLanguage(lang) {
  currentLang = lang;
  document.body.classList.toggle('lang-ta', lang === 'ta');

  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) el.innerHTML = TRANSLATIONS[key][lang];
  });

  const toggleBtnText = document.getElementById('langToggleBtnText');
  if (toggleBtnText) toggleBtnText.textContent = lang === 'en' ? 'தமிழ் பதிப்பு' : 'English Edition';

  renderTabNavigation(lang);
  renderStatewideSeatsTally(lang);
  renderSeatGridLegend(lang);
  if (typeof renderFindingsGrid === 'function') renderFindingsGrid(lang);
  if (typeof renderFindingsCards === 'function') renderFindingsCards(lang);
  if (typeof renderVacantSeatsSection === 'function') renderVacantSeatsSection(lang);
  if (typeof renderGovtFormationBox === 'function') renderGovtFormationBox(lang);
  if (typeof renderDistrictLedger === 'function') renderDistrictLedger();
  if (typeof renderTopBottomVoterGaps === 'function') renderTopBottomVoterGaps(lang);
  if (typeof renderCharts === 'function') renderCharts(lang);

  const labels = {
    "North":   { en: "NORTH",   ta: "வடக்கு" },
    "West":    { en: "WEST",    ta: "மேற்கு" },
    "Central": { en: "CENTRAL", ta: "மத்திய" },
    "South":   { en: "SOUTH",   ta: "தெற்கு" }
  };
  for (const reg in labels) {
    const el = document.getElementById('svg-label-' + reg);
    if (el) el.textContent = lang === 'en' ? labels[reg].en : labels[reg].ta;
  }

  if (typeof populateConstituencyDropdown === 'function') {
    populateConstituencyDropdown();
  } else if (typeof loadConstituencyDetails === 'function') {
    const select = document.getElementById('constituencySelect');
    if (select && select.value) loadConstituencyDetails(select.value);
  }

  const activeSvgPath = document.querySelector('.svg-region-path.active');
  if (activeSvgPath && typeof updateSvgRegionPane === 'function') {
    updateSvgRegionPane(activeSvgPath.id.replace('svg-reg-', ''));
  } else {
    const pane = document.getElementById('svgRegionInfo');
    if (pane) {
      pane.innerHTML = lang === 'en'
        ? "<strong>Click a region</strong> on the map engraving above to view regional seat counts and average turnout patterns."
        : "மாநிலப் பகுதிகளின் இருக்கை எண்ணிக்கையை அறிய மேலே உள்ள வரைபடத்தில் <strong>ஏதேனும் ஒரு பகுதியை அழுத்தவும்</strong>.";
    }
  }

  if (typeof renderTickerClassifieds === 'function') renderTickerClassifieds(lang);

  if (typeof renderDynamicFrontPage === 'function') renderDynamicFrontPage(lang);
  if (typeof updateLiveTime === 'function') updateLiveTime();
  if (activeTabId === 'ministers' && typeof renderMinistersPage === 'function') renderMinistersPage(lang);
}

/* Tab navigation */
const tabMetadata = [
  { id: "frontpage",  en: "I. Front Page",             ta: "I. முகப்புப் பக்கம்" },
  { id: "explorer",   en: "II. Constituency Explorer",  ta: "II. தொகுதி விவரங்கள்" },
  { id: "voters",     en: "III. Voter Archives",        ta: "III. வாக்காளர் ஆவணங்கள்" },
  { id: "statistics", en: "IV. Statistical Report",     ta: "IV. புள்ளிவிவர அறிக்கை" },
  { id: "map",        en: "V. Map Explorer",            ta: "V. வரைபடம்" },
  { id: "ministers",  en: "VI. Members",   ta: "VI. உறுப்பினர்கள்" }
];

let activeTabId = "frontpage";

function renderTabNavigation(lang) {
  const nav = document.getElementById('tabNavContainer');
  if (!nav) return;
  nav.innerHTML = "";
  tabMetadata.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = `tab-btn ${tab.id === activeTabId ? 'active' : ''}`;
    btn.setAttribute('data-tab-id', tab.id);
    btn.onclick = () => { activeTabId = tab.id; switchTab(tab.id); };
    btn.textContent = lang === 'en' ? tab.en : tab.ta;
    nav.appendChild(btn);
  });
}

function switchTab(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.np-page').forEach(page => page.classList.remove('active'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    const matched = tabMetadata.find(t => (currentLang === 'en' ? t.en : t.ta) === btn.textContent);
    if (matched && matched.id === tabId) btn.classList.add('active');
  });

  const targetPage = document.getElementById('page-' + tabId);
  if (targetPage) targetPage.classList.add('active');

  if (tabId === 'explorer' && leafletMap) setTimeout(() => leafletMap.invalidateSize(), 200);
  if (tabId === 'map') {
    setTimeout(() => {
      if (!statewideMapInstance) initStatewideMap();
      else statewideMapInstance.invalidateSize();
    }, 200);
  }
  if (tabId === 'ministers') {
    renderMinistersPage(currentLang);
  }
  if (tabId === 'statistics' && typeof statisticsModule !== 'undefined') {
    statisticsModule.init();
  }
}

function openConstituencyExplorer(acNo) {
  switchTab('explorer');
  const selectBox = document.getElementById('constituencySelect');
  if (selectBox) {
    selectBox.value = acNo.toString();
  }
  if (typeof loadConstituencyDetails === 'function') {
    loadConstituencyDetails(acNo.toString());
  }
  const cardArea = document.getElementById('cardContentArea') || document.getElementById('page-explorer');
  if (cardArea) {
    cardArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateLiveTime() {
  const dateEl = document.getElementById('liveDateTime');
  if (!dateEl) return;
  const now = new Date();
  if (currentLang === 'ta') {
    const dayNames = ['ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்க்கிழமை', 'புதன்கிழமை', 'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'];
    const monthNames = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    const day = dayNames[now.getDay()];
    const date = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    dateEl.textContent = `${day}, ${date} ${month} ${year} · ${hours}:${minutes}:${seconds}`;
  } else {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const timeStr = now.toTimeString().split(' ')[0];
    dateEl.textContent = `${dateStr} · ${timeStr}`;
  }
}

/* Initialization */
window.onload = async function() {
  renderTabNavigation(currentLang);
  initFrontPageGrid();
  initLeafletMap();
  updateLiveTime();
  setInterval(updateLiveTime, 1000);
  await loadFindingsData();
  
  // Pre-load ministers to window.MINISTERS_DATA for the explorer
  try {
    const res = await fetch('/api/ministers');
    if (res.ok) {
      window.MINISTERS_DATA = await res.json();
    }
  } catch(e) {}

  // Pre-load officials to window.OFFICIALS_DATA for the explorer
  try {
    const res = await fetch('/api/officials');
    if (res.ok) {
      window.OFFICIALS_DATA = await res.json();
    }
  } catch(e) {}

  // Pre-load Tamil constituency name mappings
  try {
    const res = await fetch('/tamil_constituencies_ac.json');
    if (res.ok) {
      window.TAMIL_CONSTITUENCIES_MAP = await res.json();
    }
  } catch(e) {}

  // Pre-load Tamil candidate name mappings (winner/runner-up for all 234 seats)
  try {
    const res = await fetch('/tamil_candidates.json');
    if (res.ok) {
      window.TAMIL_CANDIDATES_MAP = await res.json();
    }
  } catch(e) {}

  await loadBQConstituencyData();
  await loadBQPartyWinners();
};

document.addEventListener('DOMContentLoaded', () => {
  renderTabNavigation(currentLang);
});


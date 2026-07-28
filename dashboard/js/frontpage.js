/* =============================================================
   frontpage.js — Dynamic front page, seat grid, ticker, tally
   ============================================================= */

function getShortCmName(fullName, lang) {
  if (fullName.includes("Vijay"))       return lang === 'en' ? "Vijay"       : "விஜய்";
  if (fullName.includes("Stalin"))      return lang === 'en' ? "Stalin"      : "ஸ்டாலின்";
  if (fullName.includes("Palaniswami")) return lang === 'en' ? "Palaniswami" : "பழனிசாமி";
  const parts = fullName.split(' ');
  return parts[parts.length - 1];
}

const HERO_ARTICLE_EN = [
  "Film star-turned-politician C Joseph Vijay has been sworn in as the new chief minister of the Indian state of Tamil Nadu, ending days of political uncertainty. The 51-year-old's newly-formed party Tamilaga Vettri Kazhagam (TVK) won 108 seats in last week's vote-counting - leaving him 10 seats short of a majority in the 234-member assembly. India's main opposition Congress, with five seats, pledged support within hours of the results. But state Governor Rajendra Vishwanath Arlekar insisted that TVK submit proof of support from 118 legislators needed to form the government. On Saturday night, the actor received an appointment letter after he secured support from a number of smaller parties.",
  "The TVK now has support from four parties - Communist Party of India (CPI), Communist Party of India-Marxist (CPI-M), Viduthalai Chiruthaigal Katchi (VCK) and Indian Union Muslim League (IUML). All the four parties have two assembly seats each which means TVK now has support from 120 legislators. The confirmation that Vijay would form the government came on Saturday after he called on the governor - their fourth meeting in as many days. Sunday morning's oath-taking ceremony was held at the Jawaharlal Nehru Stadium in Chennai, the state capital, amid very tight security. Nine ministers were sworn in along with the actor. The ceremony was attended by several prominent politicians, including ally Congress party's senior leader Rahul Gandhi who flew in from Delhi for the ceremony. Film personalities and industrialists were also in attendance.",
  "Popularly known as \"Thalapathy\" Vijay (Commander Vijay), the 51-year-old actor has appeared in 69 films and is among India's highest paid stars. His spectacular rise on the political stage has been compared with that of matinee idol MG Ramachandran, who formed his own party and became chief minister in 1977. Vijay commands immense popularity among Tamil Nadu's youth and women and his win has delighted fans and supporters.",
  "His party leaders and their allies had criticised the governor's refusal to invite Vijay to form the government. The actor first called on Governor Arlekar on Wednesday and staked claim to form the next government. He met him again on Thursday. Hours later, the governor's office put out a press release explaining that \"the requisite majority support in the legislative assembly, essential for forming the government, has not been established\". Analysts said the governor's priority was to ensure the formation of a stable government which would be able to prove its majority in the assembly. Some constitutional experts, however, said there was enough precedent where the governor invited the single largest party or coalition to form a government and gave them time to prove their majority on the floor of the house. They said it was unfair to deny Vijay that opportunity.",
  "The Indian superstar taking a shot at political greatness. A 'fun' superstar stuns rivals and reshapes politics in an Indian state. Tamil Nadu's politics has been dominated by two regional parties - Dravida Munnetra Kazhagam (DMK) and All India Anna Dravida Munnetra Kazhagam (AIADMK) - which have alternated in power for decades. The TVK defied expectations and demolished that duopoly to emerge as the single largest party in the recent election. The actor's party defeated the powerful incumbent DMK, led by MK Stalin. In the past few days, as uncertainty over the fate of TVK continued, Indian media reports hinted at all sorts of permutations and combinations that could be used to form a new government, including one that could see bitter rivals DMK and the AIADMK joining hands. Tamil Nadu has long seen cinema mixing with power and Vijay has followed in the footsteps of film stars Ramachandran and his successor J Jayalalithaa who led the state for decades. However, unlike them, he doesn't have any political experience. Soon after launching TVK in 2024, he announced that he would retire from films to pursue politics full-time."
];

const HERO_ARTICLE_TA = [
  "திரைப்பட நட்சத்திரமும் அரசியல்வாதியுமான சி. ஜோசப் விஜய், பல நாட்களாக நீடித்த அரசியல் நிச்சயமற்ற நிலைக்கு முற்றுப்புள்ளி வைத்து, இந்தியாவின் தமிழ்நாடு மாநிலத்தின் புதிய முதலமைச்சராகப் பதவியேற்றுள்ளார். 51 வயதான இவரின் புதிதாக உருவாக்கப்பட்ட கட்சியான 'தமிழக வெற்றி கழகம்' (TVK), கடந்த வாரம் நடைபெற்ற வாக்கு எண்ணிக்கையில் 108 இடங்களைக் கைப்பற்றியது; இது 234 உறுப்பினர்களைக் கொண்ட சட்டமன்றத்தில் பெரும்பான்மைக்குத் தேவையான இடங்களை விட 10 இடங்கள் குறைவாகும். தேர்தல் முடிவுகள் வெளியான சில மணிநேரங்களிலேயே, ஐந்து இடங்களைக் கொண்ட இந்தியாவின் முக்கிய எதிர்க்கட்சியான காங்கிரஸ் தனது ஆதரவை அறிவித்தது. இருப்பினும், ஆட்சி அமைக்கத் தேவையான 118 சட்டமன்ற உறுப்பினர்களின் ஆதரவுக்கான ஆதாரத்தை சமர்ப்பிக்குமாறு மாநில ஆளுநர் ராஜேந்திர விஸ்வநாத் அர்லேகர் வலியுறுத்தினார். சனிக்கிழமை இரவு, பல சிறிய கட்சிகளின் ஆதரவைப் பெற்ற பிறகு, அந்த நடிகர் தனது நியமனக் கடிதத்தைப் பெற்றார்.",
  "தற்போது TVK-விற்கு இந்திய கம்யூனிஸ்ட் கட்சி (CPI), இந்திய கம்யூனிஸ்ட் கட்சி (மார்க்சிஸ்ட்) (CPI-M), விடுதலைச் சிறுத்தைகள் கட்சி (VCK) மற்றும் இந்திய யூனியன் முஸ்லிம் லீக் (IUML) ஆகிய நான்கு கட்சிகளின் ஆதரவு உள்ளது. இக்கட்சிகள் ஒவ்வொன்றும் தலா இரண்டு சட்டமன்ற இடங்களைக் கொண்டுள்ளதால், TVK-விற்கு இப்போது மொத்தம் 120 சட்டமன்ற உறுப்பினர்களின் ஆதரவு உள்ளது. கடந்த நான்கு நாட்களில் நான்காவது முறையாக ஆளுநரைச் சந்தித்த பிறகு, விஜய் ஆட்சி அமைப்பார் என்பது சனிக்கிழமையன்று உறுதிப்படுத்தப்பட்டது. ஞாயிற்றுக்கிழமை காலை, மாநிலத் தலைநகரான சென்னையில் உள்ள ஜவஹர்லால் நேரு விளையாட்டு அரங்கில் பலத்த பாதுகாப்புக்கு மத்தியில் பதவியேற்பு விழா நடைபெற்றது. அந்த நடிகருடன் மேலும் ஒன்பது அமைச்சர்களும் பதவியேற்றனர். இவ்விழாவில் பல முக்கிய அரசியல் தலைவர்கள் கலந்துகொண்டனர்; குறிப்பாக, இதற்காகவே டெல்லியிலிருந்து அதாவது கூட்டணிக் கட்சியின் காங்கிரஸின் மூத்த தலைவர் ராகுல் காந்தியும் இதில் பங்கேற்றார். திரைப்படத் துறையினர் மற்றும் தொழிலதிபர்களும் இவ்விழாவில் கலந்துகொண்டனர்.",
  "\"தளபதி\" விஜய் என்று பிரபலமாக அறியப்படும் 51 வயதான இந்த நடிகர், 69 திரைப்படங்களில் நடித்துள்ளார் மற்றும் இந்தியாவின் அதிக ஊதியம் பெறும் நட்சத்திரங்களில் ஒருவராகவும் திகழ்கிறார். அரசியல் களத்தில் அவரது அபாரமான எழுச்சி, 1977-ல் சொந்தக் கட்சியைத் தொடங்கி முதலமைச்சரான பிரபல திரைப்பட நட்சத்திரம் எம்.ஜி. ராமச்சந்திரனின் (MGR) அரசியல் பயணத்துடன் ஒப்பிடப்படுகிறது. தமிழக இளைஞர்கள் மற்றும் பெண்கள் மத்தியில் விஜய் பெரும் செல்வாக்கைக் கொண்டுள்ளார்; அவரது வெற்றி அவரது ரசிகர்கள் மற்றும் ஆதரவாளர்களுக்கு மிகுந்த மகிழ்ச்சியை அளித்துள்ளது.",
  "அரசை அமைக்க விஜயை ஆளுநர் அழைக்க மறுத்ததை அவரது கட்சித் தலைவர்களும் கூட்டணிக் கட்சியினரும் விமர்சித்திருந்தனர். அந்த நடிகர் முதலில் புதன்கிழமையன்று ஆளுநர் அர்லேகரைச் சந்தித்து, அடுத்த அரசை அமைப்பதற்கான உரிமையைக் கோரினார். பின்னர் வியாழக்கிழமையும் அவரைச் சந்தித்துப் பேசினார். சில மணிநேரங்களுக்குப் பிறகு, \"அரசை அமைப்பதற்குத் தேவையான சட்டப்பேரவை பெரும்பான்மை ஆதரவு உறுதிப்படுத்தப்படவில்லை\" என்று விளக்கி ஆளுநர் அலுவலகம் ஒரு பத்திரிகை அறிக்கையை வெளியிட்டது. சட்டப்பேரவையில் தங்கள் பெரும்பான்மையை நிரூபிக்கக்கூடிய ஒரு நிலையான அரசை அமைப்பதை உறுதி செய்வதே ஆளுநரின் முன்னுரிமையாக இருந்தது என்று அரசியல் ஆய்வாளர்கள் கூறினர். இருப்பினும், தனிப்பெரும் கட்சி அல்லது கூட்டணியை அரசை அமைக்க அழைத்து, அவையில் பெரும்பான்மையை நிரூபிக்க அவர்களுக்கு அவகாசம் அளித்த முன்னுதாரணங்கள் பல உள்ளன என்று சில அரசியலமைப்புச் சட்ட நிபுணர்கள் சுட்டிக்காட்டினர். விஜய்க்கு அந்த வாய்ப்பை மறுப்பது நியாயமற்றது என்றும் அவர்கள் கூறினர்.",
  "அரசியல் மேன்மையை நோக்கி அடியெடுத்து வைக்கும் இந்திய சூப்பர் ஸ்டார். 'கலகலப்பான' சூப்பர் ஸ்டார் ஒருவர் அரசியல் எதிரிகளை வியக்க வைத்து, ஒரு இந்திய மாநிலத்தின் அரசியலையே மாற்றியமைக்கிறார். தமிழக அரசியல் பல தசாப்தங்களாக திராவிட முன்னேற்றக் கழகம் (திமுக) மற்றும் அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் (அதிமுக) ஆகிய இரு பிராந்தியக் கட்சிகளின் ஆதிக்கத்திலேயே இருந்து வந்துள்ளது; இக்கட்சிகள் மாறி மாறி ஆட்சியைப் பிடித்து வந்துள்ளன. எதிர்பார்ப்புகளை முறியடித்து, அந்த இருகட்சி ஆதிக்கத்தை உடைத்தெறிந்து, சமீபத்திய தேர்தலில் டிவிகே (TVK) தனிப்பெரும் கட்சியாக உருவெடுத்தது. எம்.கே. ஸ்டாலின் தலைமையிலான வலிமைமிக்க ஆளும் கட்சியான திமுகவை அந்த நடிகரின் கட்சி தோற்கடித்தது. கடந்த சில நாட்களாக, டிவிகே-வின் எதிர்காலம் குறித்த நிச்சயமற்ற சூழல் நிலவிய நிலையில், புதிய அரசை அமைப்பதற்கான பல்வேறு சாத்தியக்கூறுகள் குறித்து இந்திய ஊடகங்கள் செய்திகளை வெளியனவாக்கின; இதில் கடும் எதிரிகளான திமுக மற்றும் அதிமுக கைகோர்க்கும் வாய்ப்பும் அடங்கும். தமிழகத்தில் சினிமாவுக்கும் அதிகாரத்திற்கும் இடையிலான பிணைப்பு நீண்டகாலமாக இருந்து வருகிறது; பல தசாப்தங்களாக மாநிலத்தை வழிநடத்திய திரைப்பட நட்சத்திரங்களான எம்.ஜி. ராமச்சந்திரன் மற்றும் அவருக்குப் பின் வந்த ஜெ. ஜெயலலிதா ஆகியோரின் வழியைத்தான் விஜய்யும் பின்பற்றுகிறார். இருப்பினும், அவர்களைப் போலன்றி, இவருக்கு அரசியல் அனுபவம் ஏதுமில்லை. 2024-ல் 'டிவிகே' (TVK) கட்சியைத் தொடங்கிய உடனேயே, முழுநேர அரசியலில் ஈடுபடுவதற்காகத் திரைப்படத் துறையிலிருந்து விலகப்போவதாகவும் அவர் அறிவித்தார்."
];

const PARTY_STYLE_MAP = {
  "TVK": {
    border: "#ffcc00",
    text: "#ffcc00",
    bg: "#1e1b12",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#ffcc00; flex:1;"></div><div style="background:#cc0000; flex:1;"></div><div style="background:#ffcc00; flex:1;"></div></div>`
  },
  "DMK": {
    border: "#ff4444",
    text: "#ff4444",
    bg: "#221414",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#cc0000; flex:1;"></div><div style="background:#000000; flex:1;"></div></div>`
  },
  "AIADMK": {
    border: "#22cc55",
    text: "#22cc55",
    bg: "#132218",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#000000; flex:1;"></div><div style="background:#ffffff; flex:1;"></div><div style="background:#cc0000; flex:1;"></div></div>`
  },
  "ADMK": {
    border: "#22cc55",
    text: "#22cc55",
    bg: "#132218",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#000000; flex:1;"></div><div style="background:#ffffff; flex:1;"></div><div style="background:#cc0000; flex:1;"></div></div>`
  },
  "INC": {
    border: "#3399ff",
    text: "#3399ff",
    bg: "#141c28",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#ff8800; flex:1;"></div><div style="background:#ffffff; flex:1;"></div><div style="background:#00aa00; flex:1;"></div></div>`
  },
  "PMK": {
    border: "#ffaa00",
    text: "#ffaa00",
    bg: "#221c12",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#0000cc; flex:1;"></div><div style="background:#ffff00; flex:1;"></div><div style="background:#cc0000; flex:1;"></div></div>`
  },
  "IUML": {
    border: "#00cc44",
    text: "#00cc44",
    bg: "#122217",
    flag: `<div style="background:#008800; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
  },
  "CPI": {
    border: "#ff3333",
    text: "#ff3333",
    bg: "#221414",
    flag: `<div style="background:#cc0000; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
  },
  "CPI(M)": {
    border: "#ff3333",
    text: "#ff3333",
    bg: "#221414",
    flag: `<div style="background:#cc0000; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
  },
  "CPI-M": {
    border: "#ff3333",
    text: "#ff3333",
    bg: "#221414",
    flag: `<div style="background:#cc0000; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
  },
  "VCK": {
    border: "#3399ff",
    text: "#3399ff",
    bg: "#141c28",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#0000cc; flex:1;"></div><div style="background:#cc0000; flex:1;"></div></div>`
  },
  "BJP": {
    border: "#ff8800",
    text: "#ff8800",
    bg: "#221912",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#ff8800; flex:1;"></div><div style="background:#00aa00; flex:1;"></div></div>`
  },
  "DMDK": {
    border: "#ffcc00",
    text: "#ffcc00",
    bg: "#1e1b12",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#ffcc00; flex:1;"></div><div style="background:#cc0000; flex:1;"></div><div style="background:#000000; flex:1;"></div></div>`
  },
  "AMMK": {
    border: "#22cc55",
    text: "#22cc55",
    bg: "#132218",
    flag: `<div style="display:flex; flex-direction:column; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"><div style="background:#000000; flex:1;"></div><div style="background:#ffffff; flex:1;"></div><div style="background:#cc0000; flex:1;"></div></div>`
  }
};

let BQ_PARTY_WINNERS = [];

async function loadBQPartyWinners() {
  try {
    const res = await fetch('/api/party-winners');
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching party winners API`);
    const data = await res.json();
    if (data && data.length > 0) {
      BQ_PARTY_WINNERS = data;
      console.log(`[BigQuery] Successfully loaded ${data.length} party winner tallies.`);
    }
  } catch (err) {
    console.error('[BigQuery] Could not load party winners, using fallback:', err);
    BQ_PARTY_WINNERS = [
      {"party_code": "TVK", "party_full": "Tamilaga Vettri Kazhagam", "seats_won": 108},
      {"party_code": "DMK", "party_full": "Dravida Munnetra Kazhagam", "seats_won": 59},
      {"party_code": "ADMK", "party_full": "All India Anna Dravida Munnetra Kazhagam", "seats_won": 47},
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
  }
}

function renderDynamicFrontPage(lang) {
  let totalTurnout = 0, minMargin = Infinity, closestAC = null;
  let notaOutpollsCount = 0, femaleLedCount = 0, tvkSeatsCount = 0;

  try {
    for (let i = 1; i <= 234; i++) {
      if (typeof getConstituencyData === 'function') {
        const acData = getConstituencyData(i.toString());
        if (acData) {
          totalTurnout += acData.turnout_pct || 0;
          if (acData.margin < minMargin) { minMargin = acData.margin; closestAC = acData; }
          if (acData.nota_votes > acData.margin) notaOutpollsCount++;
          if ((acData.voted_female / acData.electors_female) > (acData.voted_male / acData.electors_male)) femaleLedCount++;
          if (acData.winner_party === "TVK") tvkSeatsCount++;
        }
      }
    }
  } catch(e) {}

  const avgTurnoutVal = totalTurnout / 234;
  const avgTurnoutStr = avgTurnoutVal.toFixed(2);

  const turnoutNumBox = document.getElementById('frontPageStatTurnout');
  const turnoutSubBox = document.getElementById('frontPageStatTurnoutSub');
  if (turnoutNumBox) turnoutNumBox.textContent = Math.round(avgTurnoutVal) + "%";
  if (turnoutSubBox) turnoutSubBox.textContent = `${avgTurnoutStr}% Turnout`;

  // CM info
  const cm = { Name: { en: "C. Joseph Vijay", ta: "சி. ஜோசப் விஜய்" }, Party: "TVK" };
  const cmName = lang === 'en' ? cm.Name.en : cm.Name.ta;
  const cmParty = cm.Party;
  const cmShortName = getShortCmName(cm.Name.en, lang);
  const cmShortNameUpper = getShortCmName(cm.Name.en, 'en').toUpperCase();

  // CENTER COLUMN
  const centerCol = document.getElementById('frontPageCenterCol');
  if (centerCol) {
    const bannerRed  = lang === 'en' ? "Government Formation" : "தமிழகத்தின் புதிய அத்தியாயம்";
    const bannerSub  = lang === 'en' ? `A New Chapter for Tamil Nadu: ${cmName} Sworn In` : `தமிழக முதல்வராக ${cmName} இன்று பதவியேற்றார்`;
    const headlineText = lang === 'en'
      ? `THE PEOPLE'S MANDATE BECOMES GOVERNMENT: ${cmShortNameUpper} SWORN IN AS TAMIL NADU CHIEF MINISTER`
      : `மக்களின் தீர்ப்பு அரசாகியது: தமிழக முதலமைச்சராக ${cmShortName} பதவியேற்றார்`;
    const subheadingText = lang === 'en'
      ? "The swearing-in ceremony was held in Chennai in the presence of the Governor, marking the formal beginning of the new administration after the 2026 Assembly elections."
      : "சென்னை ஜவஹர்லால் நேரு உள்விளையாட்டு அரங்கில் நடைபெற்ற பதவியேற்பு விழாவில் ஆளுநர் முன்னிலையில் பதவிப்பிரமாணம் செய்துகொண்டார்.";

    let heroImgHtml = "";
    if (cm.Name.en === "C. Joseph Vijay") {
      heroImgHtml = `<div class="vintage-photo-container rectangular" style="margin-bottom:10px;"><img src="img/vijay_swearing_in.png" class="vintage-photo-img" alt="Swearing in ceremony"></div>`;
    } else {
      heroImgHtml = `
        <div class="vintage-photo-container rectangular" style="margin-bottom:10px; background:var(--paper-bg-darker);">
          <svg viewBox="0 0 400 200" style="width:100%; height:100%; stroke:var(--ink-charcoal); fill:none; stroke-width:1.5;">
            <rect x="5" y="5" width="390" height="190" fill="var(--paper-bg)" stroke="var(--ink-charcoal)" stroke-width="1" stroke-dasharray="3 3"/>
            <text x="200" y="160" text-anchor="middle" font-size="10" font-weight="bold" fill="var(--ink-red)">OATH OF OFFICE &amp; SECRECY</text>
            <text x="200" y="175" text-anchor="middle" font-size="11" font-weight="900" fill="var(--ink-charcoal)">${cmName.toUpperCase()}</text>
          </svg>
        </div>`;
    }

    const imgCaptionText = lang === 'en'
      ? "Oath Taking Ceremony: The new 2026 Government of Tamil Nadu officially assumed office today."
      : "பதவியேற்பு தருணம்: தமிழகத்தின் 2026 புதிய அரசு இன்று அதிகாரப்பூர்வமாக பொறுப்பேற்றது.";

    const makeParagraphs = (arr) => {
      return arr.map((p, idx) => {
        if (p.startsWith("CAPTION:")) {
          const captionText = p.replace("CAPTION:", "").trim();
          return `<p style="font-family: 'Courier Prime', monospace; font-size: 10px; font-weight: 700; line-height: 1.45; text-align: center; color: var(--ink-light); margin: 16px 0; border-top: 1px dashed var(--paper-border); border-bottom: 1px dashed var(--paper-border); padding: 8px 0; text-transform: uppercase;">[${captionText}]</p>`;
        }
        if (idx === 0) {
          return `<p class="dropcap" style="margin-bottom:12px; text-indent:0; text-align:justify; font-size:14.5px; line-height:1.6;">${p}</p>`;
        }
        return `<p style="margin-bottom:12px; text-indent:16px; text-align:justify; font-size:14.5px; line-height:1.6;">${p}</p>`;
      }).join('');
    };

    const enHtml = makeParagraphs(HERO_ARTICLE_EN);
    const taHtml = makeParagraphs(HERO_ARTICLE_TA);
    const activeHtml = lang === 'en' ? enHtml : taHtml;

    let partyTallyHtml = "";
    const partyWinners = window.BQ_PARTY_WINNERS || [];
    const PARTY_CODE_TA = {
      "TVK": "தவெக",
      "DMK": "திமுக",
      "AIADMK": "அதிமுக",
      "ADMK": "அதிமுக",
      "INC": "காங்",
      "PMK": "பாமக",
      "IUML": "முஸ்லிம் லீக்",
      "CPI": "இகம்",
      "VCK": "விசிக",
      "CPI(M)": "இகம்(மா)",
      "CPI-M": "இகம்(மா)",
      "BJP": "பாஜக",
      "DMDK": "தேமுதிக",
      "AMMK": "அமமுக"
    };

    if (partyWinners && partyWinners.length > 0) {
      const listItems = partyWinners.map(item => {
        let code = item.party_code || "OTH";
        if (code === "AIADMK") code = "ADMK";
        if (code === "Amma Makkal Munnettra Kazagam") code = "AMMK";
        
        const style = PARTY_STYLE_MAP[code] || {
          border: "#888888",
          text: "#888888",
          bg: "#1c1c1c",
          flag: `<div style="background:#888888; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
        };
        const flagImg = typeof getPartyFlagHtml === 'function' ? getPartyFlagHtml(code, "width: 14px; height: 9px; object-fit: cover; border-radius: 1px; border: 1px solid rgba(255,255,255,0.3); vertical-align: middle;") : "";
        const flagDisplay = flagImg || style.flag;
        const displayCode = (lang === 'ta' && PARTY_CODE_TA[code]) ? PARTY_CODE_TA[code] : code;
        
        return `
          <div class="party-pill-badge" style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: #111111;
            border: 1.5px solid ${style.border};
            color: ${style.text};
            padding: 4px 10px;
            border-radius: 20px;
            font-family: 'Courier Prime', monospace;
            font-size: 11.5px;
            font-weight: 800;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          ">
            ${flagDisplay}
            <span>${displayCode}: ${item.seats_won}</span>
          </div>`;
      }).join('');
      
      partyTallyHtml = `
        <div class="party-winners-banner" style="
          margin-top: 20px; 
          margin-bottom: 20px; 
          border-top: 3px double var(--paper-border-dark); 
          border-bottom: 3px double var(--paper-border-dark); 
          padding: 10px 8px; 
          background: #181818; 
          display: flex; 
          flex-wrap: wrap; 
          justify-content: center; 
          align-items: center;
          gap: 8px 10px; 
          clear: both;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
        ">
          ${listItems}
        </div>`;
    }

    centerCol.innerHTML = `
      ${partyTallyHtml}
      <div class="hero-sub-banner">${bannerRed}</div>
      <div class="hero-sub-banner-second">${bannerSub}</div>
      <h2 class="article-headline lead-broadside">${headlineText}</h2>
      <div class="hero-subheading" style="margin-bottom:15px;">${subheadingText}</div>
      
      <div class="hero-story-container" style="overflow: hidden; margin-top: 15px; border-bottom: 2px solid var(--paper-border-dark); padding-bottom: 20px;">
        <!-- Left Floated Photo & Caption -->
        <div class="hero-photo-inset" style="float: left; width: 44%; margin-right: 18px; margin-bottom: 12px; display: flex; flex-direction: column;">
          ${heroImgHtml}
          <div class="hero-photo-caption" style="margin-top: 8px;">${imgCaptionText}</div>
        </div>
        
        <!-- Article Text wrapping around the photo -->
        <div class="hero-text-body" style="font-family: ${lang === 'en' ? "'Playfair Display', Georgia, serif" : "'Noto Serif Tamil', serif"}; color: var(--ink-charcoal);">
          ${activeHtml}
        </div>
      </div>`;
  }

  // RIGHT COLUMN: Render 6 featured findings in the sidebar
  const rightCol = document.getElementById('frontPageRightCol');
  if (rightCol) {
    const dataSource = (typeof FINDINGS_DATA !== 'undefined' && FINDINGS_DATA.length > 0) 
      ? FINDINGS_DATA 
      : ((typeof FINDINGS_FALLBACK !== 'undefined' && FINDINGS_FALLBACK.length > 0) ? FINDINGS_FALLBACK : []);
    const sidebarFindings = dataSource.slice(0, 6);
    const readMoreText = lang === 'ta' ? "மேலும் படிக்க →" : "Read More →";

    rightCol.innerHTML = sidebarFindings.map(f => {
      const fid = f.id || (f.finding_number ? String(f.finding_number).padStart(2, '0') : '01');
      const category = lang === 'ta' ? (f.categoryTa || f.categoryEn || 'கண்டுபிடிப்பு') : (f.categoryEn || f.categoryTa || 'Finding');
      const title = lang === 'ta' ? (f.titleTa || f.headline || f.titleEn) : (f.titleEn || f.headline || f.titleTa);
      const num = lang === 'ta' ? (f.keyNumberTa || f.keyNumber || f.key_number) : (f.keyNumber || f.key_number || f.keyNumberTa);
      const summary = lang === 'ta' ? (f.summaryTa || f.summaryEn || f.summary) : (f.summaryEn || f.summary || f.summaryTa);
      const linkUrl = f.detail_url ? `${f.detail_url}?lang=${lang}` : `findings/finding_${fid}.html?lang=${lang}`;

      return `
        <div class="sidebar-story">
          <div class="section-head" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${category || ''}</span>
            <strong style="color:var(--ink-red); font-family:'Courier Prime',monospace; font-size:12px;">${num || ''}</strong>
          </div>
          <h4 class="sidebar-headline"><a href="${linkUrl}" style="color:inherit; text-decoration:none;">${title || ''}</a></h4>
          <div class="sidebar-body" style="margin-bottom:6px;">${summary || ''}</div>
          <a href="${linkUrl}" class="finding-link" style="font-size:10px;">${readMoreText}</a>
        </div>
      `;
    }).join('');
  }

  // Render the 19 findings cards, vacant seats gazette & statewide seats tally
  if (typeof renderFindingsGrid === 'function') renderFindingsGrid(lang);
  renderVacantSeatsSection(lang);
  renderStatewideSeatsTally(lang);
}

const VACANT_SEATS_DATA = [
  {
    ac_no: 141,
    nameEn: "Trichy East",
    nameTa: "திருச்சி கிழக்கு",
    party: "TVK",
    partyTa: "தவெக",
    memberEn: "C. Joseph Vijay",
    memberTa: "சி. ஜோசப் விஜய்",
    reasonEn: "Vacated by Chief Minister C. Joseph Vijay, who won two seats in the assembly election and chose to retain the Perambur constituency.",
    reasonTa: "இரண்டு தொகுதிகளில் (பெரம்பூர் & திருச்சி கிழக்கு) வெற்றி பெற்ற முதலமைச்சர் சி. ஜோசப் விஜய், பெரம்பூர் தொகுதியைத் தக்கவைத்துக்கொண்டதால் திருச்சி கிழக்கு காலியானது.",
    image: "img/vacant_vijay.png"
  },
  {
    ac_no: 35,
    nameEn: "Madurantakam",
    nameTa: "மதுராந்தகம்",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "Maragatham Kumaravel",
    memberTa: "மரகதம் குமரவேல்",
    reasonEn: "Vacated following the resignation of Maragatham Kumaravel.",
    reasonTa: "மரகதம் குமரவேல் அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_maragatham.png"
  },
  {
    ac_no: 101,
    nameEn: "Dharapuram",
    nameTa: "தாராபுரம்",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "P. Sathyabama",
    memberTa: "பி. சத்யபாமா",
    reasonEn: "Vacated following the resignation of P. Sathyabama.",
    reasonTa: "பி. சத்யபாமா அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_sathyabama.png"
  },
  {
    ac_no: 103,
    nameEn: "Perundurai",
    nameTa: "பெருந்துறை",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "S. Jayakumar",
    memberTa: "எஸ். ஜெயக்குமார்",
    reasonEn: "Vacated following the resignation of S. Jayakumar.",
    reasonTa: "எஸ். ஜெயக்குமார் அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_jayakumar.png"
  },
  {
    ac_no: 225,
    nameEn: "Ambasamudram",
    nameTa: "அம்பாசமுத்திரம்",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "Esakki Subaya",
    memberTa: "இசக்கி சுப்பையா",
    reasonEn: "Vacated following the resignation of Esakki Subaya.",
    reasonTa: "இசக்கி சுப்பையா அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_esakki.png"
  },
  {
    ac_no: 179,
    nameEn: "Viralimalai",
    nameTa: "விராலிமலை",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "C. Vijayabaskar",
    memberTa: "சி. விஜயபாஸ்கர்",
    reasonEn: "Vacated following the resignation of C. Vijayabaskar.",
    reasonTa: "சி. விஜயபாஸ்கர் அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_cvijayabaskar.png"
  },
  {
    ac_no: 135,
    nameEn: "Karur",
    nameTa: "கரூர்",
    party: "AIADMK",
    partyTa: "அதிமுக",
    memberEn: "M.R. Vijayabhaskar",
    memberTa: "எம்.ஆர். விஜயபாஸ்கர்",
    reasonEn: "Vacated following the resignation of M.R. Vijayabhaskar.",
    reasonTa: "எம்.ஆர். விஜயபாஸ்கர் அவர்களின் ராஜினாமாவைத் தொடர்ந்து காலியானது.",
    image: "img/vacant_mrvijayabhaskar.png"
  }
];

function renderVacantSeatsSection(lang) {
  const tallyBar = document.getElementById('vacantTallyBar');
  const seatsGrid = document.getElementById('vacantSeatsGrid');
  if (!tallyBar || !seatsGrid) return;

  const isTa = lang === 'ta';

  // Render Tally Summary Bar
  if (isTa) {
    tallyBar.innerHTML = `
      <div class="vacant-tally-item">மொத்தத் தொகுதிகள்: <strong>234</strong></div>
      <div class="vacant-tally-item">செயல்பாட்டில் உள்ள சட்டமன்ற உறுப்பினர்கள்: <strong>227</strong></div>
      <div class="vacant-tally-item"><span class="vacant-badge-red">7 காலியிடங்கள்</span></div>
      <div style="width:1px; height:16px; background:var(--paper-border-dark); margin:0 4px;"></div>
      <div class="vacant-tally-item" style="color:#12702c;">அதிமுக: 47 வென்றவை <span style="color:#d30d25; font-weight:900;">(-6 காலியானது)</span> = <strong>41 இருக்கைகள்</strong></div>
      <div class="vacant-tally-item" style="color:#d30d25;">தவெக: 108 வென்றவை <span style="color:#d30d25; font-weight:900;">(-1 காலியானது)</span> = <strong>107 இருக்கைகள்</strong></div>
    `;
  } else {
    tallyBar.innerHTML = `
      <div class="vacant-tally-item">Total Assembly Divisions: <strong>234</strong></div>
      <div class="vacant-tally-item">Active Members: <strong>227</strong></div>
      <div class="vacant-tally-item"><span class="vacant-badge-red">7 Vacancies</span></div>
      <div style="width:1px; height:16px; background:var(--paper-border-dark); margin:0 4px;"></div>
      <div class="vacant-tally-item" style="color:#12702c;">AIADMK: 47 Won <span style="color:#d30d25; font-weight:900;">(-6 Vacant)</span> = <strong>41 Active Seats</strong></div>
      <div class="vacant-tally-item" style="color:#d30d25;">TVK: 108 Won <span style="color:#d30d25; font-weight:900;">(-1 Vacant)</span> = <strong>107 Active Seats</strong></div>
    `;
  }

  // Render Grid Cards
  seatsGrid.innerHTML = VACANT_SEATS_DATA.map(item => {
    const acName = isTa ? item.nameTa : item.nameEn;
    const partyName = isTa ? item.partyTa : item.party;
    const memberName = isTa ? item.memberTa : item.memberEn;
    const reasonText = isTa ? item.reasonTa : item.reasonEn;
    const statusText = isTa ? "காலியானது" : "VACANT";
    const memberLabel = isTa ? "காலிசெய்த உறுப்பினர்" : "Vacated Member";
    const seatImpact = item.party === 'AIADMK'
      ? (isTa ? '-1 இடம் (அதிமுக -6)' : '-1 Seat (AIADMK -6)')
      : (isTa ? '-1 இடம் (தவெக -1)' : '-1 Seat (TVK -1)');

    const flagHtml = typeof getPartyFlagHtml === 'function'
      ? getPartyFlagHtml(item.party, "width:22px; height:14px; object-fit:cover; border-radius:2px; border:1px solid rgba(0,0,0,0.25); display:inline-block; vertical-align:middle;")
      : "";

    const borderStyle = item.party === 'AIADMK' ? 'border-left: 5px solid #12702c;' : 'border-left: 5px solid #d30d25;';

    const photoHtml = item.image
      ? `<div class="vacant-card-photo-wrap">
           <img src="${item.image}" alt="${memberName}" class="vacant-card-photo" onerror="this.parentElement.style.display='none'">
         </div>`
      : `<div class="vacant-card-photo-wrap">
           <div class="vacant-card-photo-placeholder">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             <span>${isTa ? 'ஆவணம்' : 'VACANT'}</span>
           </div>
         </div>`;

    const clickTooltip = isTa ? "தொகுதி விவரங்களைப் பார்க்க கிளிக் செய்யவும்" : "Click to view full constituency breakdown";

    return `
      <div class="vacant-seat-card" style="${borderStyle} cursor: pointer;" onclick="openConstituencyExplorer('${item.ac_no}')" title="${clickTooltip}">
        <div class="vacant-card-main">
          <div>
            <div class="vacant-card-header">
              <span class="vacant-card-title">${acName} <span class="vacant-ac-no">(AC ${String(item.ac_no).padStart(3, '0')})</span></span>
              <span class="vacant-status-badge">${statusText}</span>
            </div>
            
            <div class="vacant-card-member-row">
              <span class="vacant-member-label">${memberLabel}:</span>
              <span class="vacant-member-name">${memberName}</span>
            </div>
            
            <div class="vacant-card-reason">${reasonText}</div>
          </div>
          
          <div class="vacant-card-footer">
            <span class="vacant-party-tag">${flagHtml} <span>${partyName}</span></span>
            <span class="vacant-impact-badge">${seatImpact}</span>
          </div>
        </div>

        ${photoHtml}
      </div>
    `;
  }).join('');
}

const PARTY_WINNERS_CARDS_DATA = [
  { code: "TVK", codeTa: "தவெக", nameEn: "Tamilaga Vettri Kazhagam", nameTa: "தமிழக வெற்றி கழகம்", seats: "107", seatsNote: "(108 Won, -1 Vacant)", seatsNoteTa: "(108 வென்றவை, -1 காலி)", share: "35.07%", color: "#d30d25", border: "#ffcc00" },
  { code: "DMK", codeTa: "திமுக", nameEn: "Dravida Munnetra Kazhagam", nameTa: "திராவிட முன்னேற்றக் கழகம்", seats: 59, share: "24.19%", color: "#d30d25", border: "#ff4444" },
  { code: "AIADMK", codeTa: "அதிமுக", nameEn: "All India Anna DMK", nameTa: "அனைத்திந்திய அண்ணா திமுக", seats: "41", seatsNote: "(47 Won, -6 Vacant)", seatsNoteTa: "(47 வென்றவை, -6 காலி)", share: "21.21%", color: "#12702c", border: "#22c55e" },
  { code: "INC", codeTa: "காங்", nameEn: "Indian National Congress", nameTa: "இந்திய தேசிய காங்கிரஸ்", seats: 5, share: "3.85%", color: "#0b407a", border: "#3399ff" },
  { code: "PMK", codeTa: "பாமக", nameEn: "Pattali Makkal Katchi", nameTa: "பாட்டாளி மக்கள் கட்சி", seats: 4, share: "3.20%", color: "#ffaa00", border: "#ffaa00" },
  { code: "IUML", codeTa: "முஸ்லிம் லீக்", nameEn: "Indian Union Muslim League", nameTa: "இந்திய யூனியன் முஸ்லிம் லீக்", seats: 2, share: "1.15%", color: "#064e3b", border: "#10b981" },
  { code: "CPI", codeTa: "இகம்", nameEn: "Communist Party of India", nameTa: "இந்திய கம்யூனிஸ்ட் கட்சி", seats: 2, share: "1.10%", color: "#cc0000", border: "#ff3333" },
  { code: "VCK", codeTa: "விசிக", nameEn: "Viduthalai Chiruthaigal Katchi", nameTa: "விடுதலைச் சிறுத்தைகள் கட்சி", seats: 2, share: "1.08%", color: "#491a66", border: "#8b3fc4" },
  { code: "CPI(M)", codeTa: "இகம்(மா)", nameEn: "CPI (Marxist)", nameTa: "இந்திய கம்யூனிஸ்ட் (மார்க்சிஸ்ட்)", seats: 2, share: "1.05%", color: "#cc0000", border: "#ff3333" },
  { code: "BJP", codeTa: "பாஜக", nameEn: "Bharatiya Janata Party", nameTa: "பாரதிய ஜனதா கட்சி", seats: 1, share: "2.10%", color: "#ff8800", border: "#ff8800" },
  { code: "DMDK", codeTa: "தேமுதிக", nameEn: "Desiya Murpokku Dravida Kazhagam", nameTa: "தேசிய முற்போக்கு திராவிட கழகம்", seats: 1, share: "0.95%", color: "#dd0000", border: "#ff4444" },
  { code: "AMMK", codeTa: "அமமுக", nameEn: "Amma Makkal Munnettra Kazagam", nameTa: "அம்மா மக்கள் முன்னேற்றக் கழகம்", seats: 1, share: "0.80%", color: "#006600", border: "#22c55e" }
];

function renderStatewideSeatsTally(lang) {
  const container = document.getElementById('frontPagePartyCardsGrid');
  if (!container) return;

  const isTa = lang === 'ta';
  const seatLabel = isTa ? 'இடங்கள்' : 'Seats';

  container.innerHTML = PARTY_WINNERS_CARDS_DATA.map(item => {
    const flagHtml = typeof getPartyFlagHtml === 'function'
      ? getPartyFlagHtml(item.code, "width:24px; height:16px; object-fit:cover; border-radius:2px; border:1px solid rgba(0,0,0,0.25); display:inline-block; vertical-align:middle;")
      : "";
    const partyName = isTa ? item.nameTa : item.nameEn;
    const partyCode = isTa ? (item.codeTa || item.code) : item.code;
    const noteText = isTa ? (item.seatsNoteTa || '') : (item.seatsNote || '');
    const seatsHtml = noteText
      ? `${item.seats} ${seatLabel} <span style="font-size:10px; color:#d30d25; font-weight:bold; display:block;">${noteText}</span>`
      : `${item.seats} ${seatLabel}`;

    return `
      <div class="party-medium-card" style="border-left: 5px solid ${item.border};">
        <div class="party-card-header">
          <div class="party-card-identity">
            ${flagHtml}
            <span class="party-card-code">${partyCode}</span>
          </div>
          <span class="party-card-seats" style="text-align:right;">${seatsHtml}</span>
        </div>
        <div class="party-card-name" title="${partyName}">${partyName}</div>
        <div class="party-card-footer">
          <span class="party-card-share-label">${isTa ? 'வாக்கு சதவீதம்' : 'Vote Share'}</span>
          <span class="party-card-share-val">${item.share}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderSeatGridLegend(lang) {
  const leg = document.getElementById('frontPageLegend');
  if (!leg) return;
  const l1 = lang === 'en' ? "TVK" : "டிவிகே";
  const l2 = lang === 'en' ? "DMK" : "திமுக";
  const l3 = lang === 'en' ? "AIADMK" : "அதிமுக";
  leg.innerHTML = `
    <div class="legend-item"><span class="legend-swatch seat-p-tvk"></span>${l1}</div>
    <div class="legend-item"><span class="legend-swatch seat-p-dmk"></span>${l2}</div>
    <div class="legend-item"><span class="legend-swatch seat-p-aiadmk"></span>${l3}</div>`;
}

function renderTickerClassifieds(lang) {
  const list = [
    { en: "<strong>CLOSEST CONTEST:</strong> Tiruppattur decided by just 1 vote for TVK.", ta: "<strong>நெருக்கமான போட்டி:</strong> திருப்பத்தூர் தொகுதியில் தவெக வெறும் 1 வாக்கு வித்தியாசத்தில் வெற்றி பெற்றது." },
    { en: "<strong>LANDSLIDE:</strong> Edappadi won by AIADMK with a margin of 98,110 votes.", ta: "<strong>பெரும்பான்மை வெற்றி:</strong> எடப்பாடியில் அதிமுக வேட்பாளர் 98,110 வாக்குகள் வித்தியாசத்தில் வெற்றி பெற்றார்." },
    { en: "<strong>POSTAL VOTES:</strong> Only one constituency (Tiruppattur) had its winner flipped by postal returns.", ta: "<strong>தபால் வாக்குகள்:</strong> தமிழ்நாட்டில் தபால் வாக்குகளால் முடிவு மாறிய ஒரே தொகுதி திருப்பத்தூர் ஆகும்." },
    { en: "<strong>RESERVED SEATS:</strong> SC seats average margin was 14,192 votes, compared to 17,544 in General seats.", ta: "<strong>தனித்தொகுதிகள்:</strong> எஸ்.சி தனித்தொகுதிகளின் சராசரி வெற்றி வித்யாசம் 14,192 வாக்குகளாகும்." },
    { en: "<strong>COALITION REPORT:</strong> CM C. Joseph Vijay cabinet contains 31 TVK, 2 INC, 1 VCK, and 1 IUML minister.", ta: "<strong>கூட்டணி அறிக்கை:</strong> முதலமைச்சர் விஜய் தலைமையிலான அமைச்சரவையில் 31 டிவிேக, 2 காங், 1 விசிக, 1 ஐயுஎம்எல் அமைச்சர்கள் உள்ளனர்." }
  ];
  const container = document.getElementById('tickerContainer');
  if (!container) return;
  let text = "";
  list.forEach(i => { text += `<span class="classified-item">${lang === 'en' ? i.en : i.ta}</span>`; });
  container.innerHTML = text + text;
}

function initFrontPageGrid() {
  const grid = document.getElementById('frontPageSeatGrid');
  if (!grid) return;
  grid.innerHTML = "";
  const seatsPool = [];
  for (let i = 0; i < 107; i++) seatsPool.push({ alliance: "tvk", id: i });
  for (let i = 0; i < 74;  i++) seatsPool.push({ alliance: "dmk", id: i + 107 });
  for (let i = 0; i < 53;  i++) seatsPool.push({ alliance: "aiadmk", id: i + 181 });

  seatsPool.forEach((seat, idx) => {
    const el = document.createElement('div');
    el.className = 'seat seat-p-' + seat.alliance;
    el.title = `Seat #${idx + 1}: ${seat.alliance.toUpperCase()}`;
    grid.appendChild(el);
  });
}

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
    console.error('[BigQuery] Could not load party winners:', err);
  }
}

function renderDynamicFrontPage(lang) {
  let totalTurnout = 0, minMargin = Infinity, closestAC = null;
  let notaOutpollsCount = 0, femaleLedCount = 0, tvkSeatsCount = 0;

  for (let i = 1; i <= 234; i++) {
    const acData = getConstituencyData(i.toString());
    totalTurnout += acData.turnout_pct;
    if (acData.margin < minMargin) { minMargin = acData.margin; closestAC = acData; }
    if (acData.nota_votes > acData.margin) notaOutpollsCount++;
    if ((acData.voted_female / acData.electors_female) > (acData.voted_male / acData.electors_male)) femaleLedCount++;
    if (acData.winner_party === "TVK") tvkSeatsCount++;
  }

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
      heroImgHtml = `<div class="vintage-photo-container rectangular" style="margin-bottom:10px;"><img src="vijay_swearing_in.png" class="vintage-photo-img" alt="Swearing in ceremony"></div>`;
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
    if (BQ_PARTY_WINNERS && BQ_PARTY_WINNERS.length > 0) {
      const listItems = BQ_PARTY_WINNERS.map(item => {
        let code = item.party_code || "OTH";
        if (code === "AIADMK") code = "ADMK";
        if (code === "Amma Makkal Munnettra Kazagam") code = "AMMK";
        
        const style = PARTY_STYLE_MAP[code] || {
          border: "#888888",
          text: "#888888",
          bg: "#1c1c1c",
          flag: `<div style="background:#888888; width:12px; height:8px; border:1px solid rgba(255,255,255,0.2);"></div>`
        };
        
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
            ${style.flag}
            <span>${code}: ${item.seats_won}</span>
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
      </div>
      ${partyTallyHtml}`;


  }

  // RIGHT COLUMN: Render 6 featured findings in the sidebar
  const rightCol = document.getElementById('frontPageRightCol');
  if (rightCol) {
    const sidebarFindings = FINDINGS_DATA.slice(0, 6);
    const readMoreText = lang === 'ta' ? "மேலும் படிக்க →" : "Read More →";

    rightCol.innerHTML = sidebarFindings.map(f => {
      const category = lang === 'ta' ? f.categoryTa : f.categoryEn;
      const title = lang === 'ta' ? f.titleTa : f.titleEn;
      const num = lang === 'ta' ? f.keyNumberTa : f.keyNumber;
      const summary = lang === 'ta' ? f.summaryTa : f.summaryEn;
      const linkUrl = `findings/finding_${f.id}.html?lang=${lang}`;

      return `
        <div class="sidebar-story">
          <div class="section-head" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${category}</span>
            <strong style="color:var(--ink-red); font-family:'Courier Prime',monospace; font-size:12px;">${num}</strong>
          </div>
          <h4 class="sidebar-headline">${title}</h4>
          <div class="sidebar-body" style="margin-bottom:6px;">${summary}</div>
          <a href="${linkUrl}" target="_blank" class="finding-link" style="font-size:10px;">${readMoreText}</a>
        </div>
      `;
    }).join('');
  }

  // Render the 19 findings cards
  renderFindingsGrid(lang);
}

function renderStatewideSeatsTally(lang) {
  const tbody    = document.getElementById('frontPageTallyBody');
  const labelSolo  = lang === 'en' ? "Solo (TVK-led)"    : "டிவிகே கூட்டணி (தனித்துப் போட்டி)";
  const labelIndia = lang === 'en' ? "INDIA (DMK-led)"   : "திமுக கூட்டணி";
  const labelNda   = lang === 'en' ? "NDA (AIADMK-led)"  : "அதிமுக கூட்டணி";
  tbody.innerHTML = `
    <tr>
      <td class="strong"><span class="legend-swatch seat-p-tvk" style="display:inline-block;vertical-align:middle;margin-right:5px"></span>${labelSolo}</td>
      <td class="strong text-right" style="color:var(--ink-red)">107</td>
      <td class="text-right">34.92%</td>
    </tr>
    <tr>
      <td class="strong"><span class="legend-swatch seat-p-dmk" style="display:inline-block;vertical-align:middle;margin-right:5px"></span>${labelIndia}</td>
      <td class="strong text-right">74</td>
      <td class="text-right">24.19%</td>
    </tr>
    <tr>
      <td class="strong"><span class="legend-swatch seat-p-aiadmk" style="display:inline-block;vertical-align:middle;margin-right:5px"></span>${labelNda}</td>
      <td class="strong text-right">53</td>
      <td class="text-right">21.21%</td>
    </tr>`;
}

function renderSeatGridLegend(lang) {
  const leg = document.getElementById('frontPageLegend');
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
    { en: "<strong>CLOSEST CONTEST:</strong> Tiruppattur decided by just 30 votes for DMK.", ta: "<strong>நெருக்கமான போட்டி:</strong> திருப்பத்தூர் தொகுதி வெறும் 30 வாக்குகள் வித்தியாசத்தில் திமுக வெற்றி பெற்றது." },
    { en: "<strong>LANDSLIDE:</strong> Edappadi won by AIADMK with a margin of 98,110 votes.", ta: "<strong>பெரும்பான்மை வெற்றி:</strong> எடப்பாடியில் அதிமுக வேட்பாளர் 98,110 வாக்குகள் வித்தியாசத்தில் வெற்றி பெற்றார்." },
    { en: "<strong>POSTAL VOTES:</strong> Only one constituency (Tiruppattur) had its winner flipped by postal returns.", ta: "<strong>தபால் வாக்குகள்:</strong> தமிழ்நாட்டில் தபால் வாக்குகளால் முடிவு மாறிய ஒரே தொகுதி திருப்பத்தூர் ஆகும்." },
    { en: "<strong>RESERVED SEATS:</strong> SC seats average margin was 14,192 votes, compared to 17,544 in General seats.", ta: "<strong>தனித்தொகுதிகள்:</strong> எஸ்.சி தனித்தொகுதிகளின் சராசரி வெற்றி வித்யாசம் 14,192 வாக்குகளாகும்." },
    { en: "<strong>COALITION REPORT:</strong> CM C. Joseph Vijay cabinet contains 31 TVK, 2 INC, 1 VCK, and 1 IUML minister.", ta: "<strong>கூட்டணி அறிக்கை:</strong> முதலமைச்சர் விஜய் தலைமையிலான அமைச்சரவையில் 31 டிவிேக, 2 காங், 1 விசிக, 1 ஐயுஎம்எல் அமைச்சர்கள் உள்ளனர்." }
  ];
  const container = document.getElementById('tickerContainer');
  let text = "";
  list.forEach(i => { text += `<span class="classified-item">${lang === 'en' ? i.en : i.ta}</span>`; });
  container.innerHTML = text + text; // doubled for seamless loop
}

function initFrontPageGrid() {
  const grid = document.getElementById('frontPageSeatGrid');
  grid.innerHTML = "";
  const seatsPool = [];
  for (let i = 0; i < 107; i++) seatsPool.push({ alliance: "tvk", id: i });
  for (let i = 0; i < 74;  i++) seatsPool.push({ alliance: "dmk", id: i + 107 });
  for (let i = 0; i < 53;  i++) seatsPool.push({ alliance: "aiadmk", id: i + 181 });

  seatsPool.forEach((seat, idx) => {
    const el = document.createElement('div');
    el.className = 'seat seat-p-' + seat.alliance;
    let cName = "Constituency " + (idx + 1);
    if (idx === 0)   cName = "GUMMIDIPOONDI";
    if (idx === 193) cName = "TIRUPPATTUR";
    if (idx === 152) cName = "EDAPPADI";
    el.title = cName + " — " + seat.alliance.toUpperCase();
    el.onclick = () => {
      switchTab('explorer');
      const matchVal = idx === 0 ? "1" : idx === 193 ? "194" : idx === 152 ? "2" : null;
      if (matchVal) {
        document.getElementById('constituencySelect').value = matchVal;
        loadConstituencyDetails(matchVal);
      } else {
        generateAndLoadMockDetails(idx + 1);
      }
    };
    grid.appendChild(el);
  });
}

function generateAndLoadMockDetails(acNo) {
  let match = CONSTITUENCY_NAMES.find(c => c.ac_no === acNo);
  const strId = acNo.toString();
  const select = document.getElementById('constituencySelect');
  let exists = false;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === strId) { exists = true; break; }
  }
  if (!exists) {
    const opt = document.createElement('option');
    opt.value = strId;
    opt.textContent = (match ? (currentLang === 'en' ? match.name.en : match.name.ta) : "AC " + acNo) + ` (AC ${acNo})`;
    select.appendChild(opt);
  }
  select.value = strId;
  loadConstituencyDetails(strId);
}

function renderTopBottomVoterGaps(lang) {
  const topBody    = document.getElementById('top5FemaleBody');
  const bottomBody = document.getElementById('bottom5FemaleBody');
  topBody.innerHTML = "";
  bottomBody.innerHTML = "";

  const topData = [
    { name: { en: "Ramanathapuram", ta: "இராமநாதபுரம்" }, reg: { en: "South",   ta: "தெற்கு" },  val: "+11.40%" },
    { name: { en: "Sivaganga",      ta: "சிவகங்கை" },     reg: { en: "South",   ta: "தெற்கு" },  val: "+10.90%" },
    { name: { en: "Perambalur",     ta: "பெரம்பலூர்" },   reg: { en: "Central", ta: "மத்திய" }, val: "+10.50%" },
    { name: { en: "Pudukkottai",    ta: "புதுக்கோட்டை" }, reg: { en: "South",   ta: "தெற்கு" },  val: "+8.90%"  },
    { name: { en: "Kanniyakumari",  ta: "கன்னியாகுமரி" }, reg: { en: "South",   ta: "தெற்கு" },  val: "+8.40%"  }
  ];
  const bottomData = [
    { name: { en: "Tiruppur",     ta: "திருப்பூர்" },    reg: { en: "West",  ta: "மேற்கு" }, val: "-2.00%" },
    { name: { en: "Kancheepuram", ta: "காஞ்சிபுரம்" },  reg: { en: "North", ta: "வடக்கு" }, val: "-1.80%" },
    { name: { en: "The Nilgiris", ta: "நீலகிரி" },       reg: { en: "West",  ta: "மேற்கு" }, val: "-1.00%" },
    { name: { en: "Erode",        ta: "ஈரோடு" },         reg: { en: "West",  ta: "மேற்கு" }, val: "-0.90%" },
    { name: { en: "Chengalpattu", ta: "செங்கல்பட்டு" }, reg: { en: "North", ta: "வடக்கு" }, val: "-0.80%" }
  ];

  topData.forEach(d => {
    topBody.insertAdjacentHTML('beforeend', `<tr>
      <td class="strong">${lang==='en'?d.name.en:d.name.ta}</td>
      <td>${lang==='en'?d.reg.en:d.reg.ta}</td>
      <td class="text-right strong" style="color:var(--ink-red)">${d.val}</td>
    </tr>`);
  });
  bottomData.forEach(d => {
    bottomBody.insertAdjacentHTML('beforeend', `<tr>
      <td class="strong">${lang==='en'?d.name.en:d.name.ta}</td>
      <td>${lang==='en'?d.reg.en:d.reg.ta}</td>
      <td class="text-right strong" style="color:var(--ink-green)">${d.val}</td>
    </tr>`);
  });
}

function renderFindingsGrid(lang) {
  const grid = document.getElementById('findingsGrid');
  if (!grid) return;

  const remainingFindings = FINDINGS_DATA.slice(6);

  grid.innerHTML = remainingFindings.map(f => {
    const title = lang === 'ta' ? f.titleTa : f.titleEn;
    const num = lang === 'ta' ? f.keyNumberTa : f.keyNumber;
    const summary = lang === 'ta' ? f.summaryTa : f.summaryEn;
    const readMore = lang === 'ta' ? "மேலும் படிக்க →" : "Read More →";

    // Pass active language to the findings details page
    const linkUrl = `findings/finding_${f.id}.html?lang=${lang}`;

    return `
      <div class="finding-card">
        <div>
          <h4 class="finding-headline">${title}</h4>
          <span class="finding-number">${num}</span>
          <div class="finding-summary">${summary}</div>
        </div>
        <a href="${linkUrl}" target="_blank" class="finding-link">${readMore}</a>
      </div>
    `;
  }).join('');
}

/* =============================================================
   explorer.js — Constituency search, card details, Leaflet map,
                 SVG region pane
   ============================================================= */

let leafletMap  = null;
let mapMarker   = null;
let geoJsonLayer = null;
const geoJsonFeaturesMap = {};

function filterConstituencySearch(val) {
  const box = document.getElementById('searchSuggestions');
  box.innerHTML = "";
  if (!val || val.length < 2) { box.style.display = "none"; return; }

  const cleanedVal = val.toUpperCase().trim();
  const matches    = CONSTITUENCY_NAMES.filter(c => c.name.en.includes(cleanedVal) || c.name.ta.includes(cleanedVal));
  const keyMatches = Object.values(KEY_CONSTITUENCIES).filter(c =>
    c.name.en.toUpperCase().includes(cleanedVal) || c.name.ta.includes(cleanedVal)
  );
  const combined = [...keyMatches, ...matches];

  if (combined.length === 0) {
    box.innerHTML = `<div style="padding:8px;color:gray;font-style:italic">No results</div>`;
    box.style.display = "block";
    return;
  }

  combined.slice(0, 8).forEach(c => {
    const d = document.createElement('div');
    d.style.cssText = "padding:8px;cursor:pointer;border-bottom:1px solid var(--paper-bg-darker)";
    const displayName = currentLang === 'en' ? c.name.en : c.name.ta;
    const displayReg  = currentLang === 'en' ? (c.region.en || c.region) : (c.region.ta || c.region);
    d.innerHTML = `<strong>${displayName}</strong> (AC ${c.ac_no}) — <span style="font-size:10px">${displayReg}</span>`;
    d.onmouseover = () => d.style.background = "var(--paper-bg-darker)";
    d.onmouseout  = () => d.style.background = "none";
    d.onclick = () => {
      box.style.display = "none";
      document.getElementById('constituencySearch').value = displayName;
      const selectBox = document.getElementById('constituencySelect');
      if (KEY_CONSTITUENCIES[c.ac_no]) selectBox.value = c.ac_no;
      loadConstituencyDetails(c.ac_no.toString());
    };
    box.appendChild(d);
  });
  box.style.display = "block";
}

function loadConstituencyDetails(id) {
  const data = getConstituencyData(id);
  const area = document.getElementById('cardContentArea');

  const marginPct  = ((data.margin / data.total_votes) * 100).toFixed(1);
  const pColors    = { "TVK": "var(--party-tvk)", "DMK": "var(--party-dmk)", "AIADMK": "var(--party-aiadmk)", "INC": "var(--party-inc)" };
  const winnerColor = pColors[data.winner_party] || "var(--party-other)";
  const runnerColor = pColors[data.runner_up_party] || "var(--party-other)";

  let alertHtml = "";
  if (data.is_vote_split) {
    alertHtml = currentLang === 'en' ? `
      <div class="alert-vintage">
        <div class="alert-vintage-title"><i class="fa-solid fa-circle-exclamation"></i> Vote-Split Finding Warning</div>
        <div class="alert-vintage-body">TVK won this seat with <strong>${data.vote_split_details.tvk_pct}%</strong>. DMK received <strong>${data.vote_split_details.dmk_pct}%</strong> and AIADMK received <strong>${data.vote_split_details.aiadmk_pct}%</strong> — combined total of <strong>${data.vote_split_details.combined_opp_pct}%</strong> outpolled the winner.</div>
      </div>` : `
      <div class="alert-vintage">
        <div class="alert-vintage-title"><i class="fa-solid fa-circle-exclamation"></i> வாக்குச் சிதறல் விழிப்புணர்வு எச்சரிக்கை</div>
        <div class="alert-vintage-body">டிவிேக வேட்பாளர் <strong>${data.vote_split_details.tvk_pct}%</strong> வாக்குகள் பெற்று வென்றுள்ளார். திமுக <strong>${data.vote_split_details.dmk_pct}%</strong> மற்றும் அதிமுக <strong>${data.vote_split_details.aiadmk_pct}%</strong> பெற்றன.</div>
      </div>`;
  } else if (data.is_postal_flip) {
    alertHtml = currentLang === 'en' ? `
      <div class="alert-vintage" style="border-color:var(--ink-red)">
        <div class="alert-vintage-title" style="color:var(--ink-red)"><i class="fa-solid fa-envelope-open-text"></i> Postal Votes Decided the Result</div>
        <div class="alert-vintage-body">This is the <strong>only seat</strong> in Tamil Nadu that flipped because of postal ballots. Without postal returns, the winner would have lost by 788 votes on EVM tallies alone.</div>
      </div>` : `
      <div class="alert-vintage" style="border-color:var(--ink-red)">
        <div class="alert-vintage-title" style="color:var(--ink-red)"><i class="fa-solid fa-envelope-open-text"></i> தபால் வாக்குகளால் மாறிய முடிவு</div>
        <div class="alert-vintage-body">தமிழ்நாட்டின் <strong>ஒரே ஒரு தொகுதி</strong> மட்டுமே தபால் வாக்குகளால் முடிவு மாறியுள்ளது.</div>
      </div>`;
  }

  let governmentBadge = "";
  if (data.is_cabinet_member) governmentBadge = `<span class="party-tag" style="background:var(--ink-red);margin-left:5px">${data.cabinet_designation}</span>`;

  let flipBadge = "";
  if (data.is_historical_flip) flipBadge = `<div class="alert-vintage" style="border-color:var(--ink-charcoal);background:none"><div class="alert-vintage-body"><strong>${currentLang==='en'?'Historical Highlight':'வரலாற்றுச் சுவடு'}:</strong> ${data.historical_narrative}</div></div>`;

  const gapValue     = ((data.voted_female/data.electors_female*100) - (data.voted_male/data.electors_male*100)).toFixed(2);
  const gapDirection = parseFloat(gapValue) > 0
    ? (currentLang==='en'?"Higher Female Turnout":"பெண்களின் வாக்குப்பதிவு அதிகம்")
    : (currentLang==='en'?"Higher Male Turnout":"ஆண்களின் வாக்குப்பதிவு அதிகம்");
  const gapSign = parseFloat(gapValue) > 0 ? "+" : "";

  const L = {
    winner:      currentLang==='en'?"Declared Winner":"வெற்றியாளர் அறிவிப்பு",
    runner:      currentLang==='en'?"Runner Up Candidate":"இரண்டாம் இடம் பெற்ற வேட்பாளர்",
    votes:       currentLang==='en'?"Votes Secured":"பெற்ற வாக்குகள்",
    margin:      currentLang==='en'?"Margin":"வாக்கு வித்தியாசம்",
    overall:     currentLang==='en'?"Overall Voter Turnout":"ஒட்டுமொத்த வாக்குப்பதிவு சதவீதம்",
    stateAvg:    currentLang==='en'?"State Avg (70%)":"மாநில சராசரி (70%)",
    gender:      currentLang==='en'?"Gender Segment":"பாலினப் பிரிவு",
    electors:    currentLang==='en'?"Electors":"வாக்காளர்கள்",
    voted:       currentLang==='en'?"Voted":"வாக்களித்தோர்",
    advantage:   currentLang==='en'?"Advantage Gap":"வாக்குப்பதிவு இடைவெளி",
    female:      currentLang==='en'?"Female Electors":"பெண் வாக்காளர்கள்",
    male:        currentLang==='en'?"Male Electors":"ஆண் வாக்காளர்கள்",
    others:      currentLang==='en'?"Third Gender / NOTA":"மூன்றாம் பாலினத்தவர் / நோட்டா",
    postal:      currentLang==='en'?"Postal Voted":"தபால் வாக்குகள்",
    districtLbl: currentLang==='en'?"District":"மாவட்டம்",
    regionLbl:   currentLang==='en'?"Region":"மண்டலம்",
    resrvLbl:    currentLang==='en'?"Reservation":"தொகுதி வகை",
    acLbl:       currentLang==='en'?"AC Seat No.":"தொகுதி எண்.",
    rollTitle:   currentLang==='en'?"Electoral Roll & Turnout Ledger":"வாக்காளர் பதிவு & வாக்குப்பதிவு விபரம்"
  };

  area.innerHTML = `
    <div class="card-header-vintage">
      <div class="ac-number-badge">${L.acLbl} ${data.ac_no.toString().padStart(3,'0')}</div>
      <h3 class="ac-title">${data.name}</h3>
      <div class="ac-meta">${L.districtLbl}: ${data.district} · ${L.regionLbl}: ${data.region} · ${L.resrvLbl}: ${data.reserved}</div>
    </div>
    ${alertHtml}${flipBadge}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:15px">
      <div style="border-right:1px dashed var(--ink-charcoal);padding-right:15px">
        <div class="section-head"><span>${L.winner}</span></div>
        <div style="font-size:18px;font-weight:900;color:var(--ink-red)">
          ${data.winner_name}
          <span class="party-tag" style="background:${winnerColor}">${data.winner_party}</span>
          ${governmentBadge}
        </div>
        <div style="font-size:12px;margin-top:5px;font-family:'Courier Prime',monospace">
          ${L.votes}: <strong>${data.winner_votes.toLocaleString()}</strong> (${((data.winner_votes/data.total_votes)*100).toFixed(2)}%)
        </div>
      </div>
      <div>
        <div class="section-head"><span>${L.runner}</span></div>
        <div style="font-size:16px;font-weight:700">
          ${data.runner_up_name}
          <span class="party-tag" style="background:${runnerColor}">${data.runner_up_party}</span>
        </div>
        <div style="font-size:12px;margin-top:5px;font-family:'Courier Prime',monospace">
          ${L.votes}: <strong>${data.runner_up_votes.toLocaleString()}</strong> (${((data.runner_up_votes/data.total_votes)*100).toFixed(2)}%)
        </div>
        <div style="font-size:10px;margin-top:4px;font-style:italic">
          ${L.margin}: <strong>${data.margin.toLocaleString()}</strong> (${marginPct}%)
        </div>
      </div>
    </div>

    <div class="section-head" style="margin-top:20px"><span>${L.rollTitle}</span></div>
    <div class="turnout-bar-container">
      <div class="turnout-bar-label"><span>${L.overall}</span><span>${data.turnout_pct}%</span></div>
      <div class="turnout-bar-track">
        <div class="turnout-bar-fill" style="width:${data.turnout_pct}%"></div>
        <div class="turnout-bar-mark" style="left:70%"></div>
        <div class="turnout-bar-mark-label" style="left:70%">${L.stateAvg}</div>
      </div>
    </div>
    <table class="np-table" style="font-size:11px;margin-top:10px">
      <thead><tr>
        <th>${L.gender}</th><th class="text-right">${L.electors}</th>
        <th class="text-right">${L.voted}</th><th class="text-right">${L.advantage}</th>
      </tr></thead>
      <tbody>
        <tr>
          <td>${L.female}</td>
          <td class="text-right">${data.electors_female.toLocaleString()}</td>
          <td class="text-right">${data.voted_female.toLocaleString()}</td>
          <td class="text-right strong" style="color:var(--ink-red)" rowspan="2">
            ${gapSign}${gapValue}%<br>
            <span style="font-size:8px;font-weight:normal;color:var(--ink-charcoal)">(${gapDirection})</span>
          </td>
        </tr>
        <tr>
          <td>${L.male}</td>
          <td class="text-right">${data.electors_male.toLocaleString()}</td>
          <td class="text-right">${data.voted_male.toLocaleString()}</td>
        </tr>
        <tr>
          <td>${L.others}</td>
          <td class="text-right">${data.electors_tg.toLocaleString()}</td>
          <td class="text-right">NOTA: ${data.nota_votes.toLocaleString()}</td>
          <td class="text-right">${L.postal}: ${data.postal_votes.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>`;

  // Leaflet map focus
  if (leafletMap) {
    if (window.TN_GEOJSON && geoJsonFeaturesMap[id]) {
      const layer = geoJsonFeaturesMap[id];
      leafletMap.fitBounds(layer.getBounds(), { maxZoom: 10, padding: [30, 30] });
      layer.bindPopup(`
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:11px">
          <strong>${data.name}</strong> (AC ${data.ac_no})<br>
          ${currentLang==='en'?'Winner':'வெற்றியாளர்'}: <strong>${data.winner_name} (${data.winner_party})</strong><br>
          ${currentLang==='en'?'Margin':'வாக்கு வித்தியாசம்'}: <strong>${data.margin.toLocaleString()}</strong>
        </div>`).openPopup();
    } else {
      let lat = 11.12, lng = 78.65;
      const reg = data.region;
      if (reg.includes("North") || reg.includes("வட")) { lat = 12.8 + (parseInt(id)%10)*0.15; lng = 79.5 + (parseInt(id)%8)*0.1; }
      else if (reg.includes("South") || reg.includes("தெற்")) { lat = 9.5 + (parseInt(id)%10)*0.15; lng = 77.8 + (parseInt(id)%8)*0.1; }
      else if (reg.includes("West") || reg.includes("மேற்")) { lat = 11.2 + (parseInt(id)%10)*0.15; lng = 77.2 + (parseInt(id)%8)*0.1; }
      else { lat = 10.8 + (parseInt(id)%10)*0.15; lng = 78.8 + (parseInt(id)%8)*0.1; }

      const popup = `<strong>${data.name}</strong><br>${currentLang==='en'?'Winner':'வெற்றியாளர்'}: ${data.winner_name} (${data.winner_party})<br>${currentLang==='en'?'Margin':'வித்தியாசம்'}: ${data.margin.toLocaleString()}`;
      if (mapMarker) { mapMarker.setLatLng([lat, lng]); mapMarker.getPopup().setContent(popup).update(); }
      else { mapMarker = L.marker([lat, lng]).addTo(leafletMap).bindPopup(popup).openPopup(); }
      leafletMap.setView([lat, lng], 8);
    }
  }

  // SVG region highlight
  document.querySelectorAll('.svg-region-path').forEach(p => p.classList.remove('active'));
  let normReg = "North";
  if (data.region.includes("South") || data.region.includes("தெற்")) normReg = "South";
  else if (data.region.includes("West") || data.region.includes("மேற்")) normReg = "West";
  else if (data.region.includes("Central") || data.region.includes("மத்")) normReg = "Central";
  const svgPath = document.getElementById('svg-reg-' + normReg);
  if (svgPath) svgPath.classList.add('active');
  updateSvgRegionPane(normReg);
}

/* Leaflet side-panel map (explorer tab) */
function initLeafletMap() {
  try {
    leafletMap = L.map('leafletMap', { zoomControl: true, attributionControl: false }).setView([11.1271, 78.6569], 7);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(leafletMap);

    if (window.TN_GEOJSON) {
      geoJsonLayer = L.geoJSON(window.TN_GEOJSON, {
        style: function(feature) {
          const acNo = feature.properties.AC_NO;
          const cData = getConstituencyData(acNo.toString());
          const pColors = { "TVK":"#d4a72c","DMK":"#a82727","AIADMK":"#277239","INC":"#2c7da0","VCK":"#6b3f87","IUML":"#2b7051" };
          return { fillColor: (cData && pColors[cData.winner_party]) || "#706757", weight:0.6, opacity:1, color:'#1e1a15', fillOpacity:0.6 };
        },
        onEachFeature: function(feature, layer) {
          const acNo = feature.properties.AC_NO;
          const cName = feature.properties.AC_NAME;
          geoJsonFeaturesMap[acNo] = layer;
          layer.on({
            mouseover: e => { e.target.setStyle({ weight:1.5, color:'#801d1d', fillOpacity:0.8 }); e.target.bringToFront(); },
            mouseout:  e => geoJsonLayer.resetStyle(e.target),
            click: () => {
              switchTab('explorer');
              const selectBox = document.getElementById('constituencySelect');
              let exists = false;
              for (let i = 0; i < selectBox.options.length; i++) if (selectBox.options[i].value === acNo.toString()) { exists = true; break; }
              if (!exists) { const opt = document.createElement('option'); opt.value = acNo.toString(); opt.textContent = cName + ` (AC ${acNo})`; selectBox.appendChild(opt); }
              selectBox.value = acNo.toString();
              loadConstituencyDetails(acNo.toString());
            }
          });
        }
      }).addTo(leafletMap);
    } else {
      L.circleMarker([9.68, 78.6], { color:'var(--ink-red)', radius:8 }).addTo(leafletMap).bindPopup("<strong>Tiruppattur</strong><br>Closest race: Won by 30 votes");
      L.circleMarker([11.6, 77.8], { color:'var(--ink-green)', radius:10 }).addTo(leafletMap).bindPopup("<strong>Edappadi</strong><br>Landslide: Won by 98,110 votes");
    }
  } catch(e) { console.log("Map load failed", e); }
}

/* SVG Regional Overview Pane */
const regionalData = {
  "North":   { name:{en:"Northern Division",ta:"வடக்கு மண்டலம்"},           seats:58, tvk:32, dmk:18, aiadmk:8,  gap:{en:"+1.20% (Females)",ta:"+1.20% (பெண்கள் கூடுதல்)"},  desc:{en:"Densely populated region with urban clusters around Chennai. TVK captured majorities inside manufacturing and IT belts.",ta:"சென்னை பெருநகரத்தைச் சுற்றியுள்ள அடர்ந்த மக்கள் தொகை கொண்ட பகுதி."} },
  "West":    { name:{en:"Western Division (Kongu)",ta:"மேற்கு மண்டலம் (கொங்கு)"},seats:52, tvk:13, dmk:16, aiadmk:23, gap:{en:"-1.10% (Males)",ta:"-1.10% (ஆண்கள் கூடுதல்)"}, desc:{en:"Traditional AIADMK stronghold with cotton textile clusters.",ta:"நெசவுத் தொழில் நிறைந்த அதிமுகவின் பாரம்பரிய கோட்டை."} },
  "Central": { name:{en:"Central & Delta Division",ta:"மத்திய & டெல்டா மண்டலம்"},seats:46, tvk:20, dmk:16, aiadmk:10, gap:{en:"+5.10% (Females)",ta:"+5.10% (பெண்கள் கூடுதல்)"}, desc:{en:"Cauvery river delta agricultural zone. Rallied heavy female voter turnouts.",ta:"காவேரி ஆற்றின் விவசாயப் பகுதி. பெண்களின் வாக்குப்பதிவு அதிகமாகப் பதிவாகியது."} },
  "South":   { name:{en:"Southern Division",ta:"தெற்கு மண்டலம்"},             seats:78, tvk:42, dmk:24, aiadmk:12, gap:{en:"+7.90% (Females)",ta:"+7.90% (பெண்கள் கூடுதல்)"}, desc:{en:"Broad drylands running down to the cape. Heavy female advantages in Ramanathapuram and Sivaganga.",ta:"தென் கோடி வரையில் பரந்து விரிந்த பகுதி. இராமநாதபுரம் மற்றும் சிவகங்கையில் பெண்களின் வாக்குப்பதிவு சாதனை."} }
};

function selectSvgRegion(regName) {
  document.querySelectorAll('.svg-region-path').forEach(p => p.classList.remove('active'));
  document.getElementById('svg-reg-' + regName).classList.add('active');
  updateSvgRegionPane(regName);
  if (leafletMap) {
    const centers = { "North":[12.8,79.7], "West":[11.2,77.5], "Central":[10.8,78.9], "South":[9.6,77.8] };
    leafletMap.setView(centers[regName], 8);
  }
}

function updateSvgRegionPane(regName) {
  const info = regionalData[regName];
  const pane = document.getElementById('svgRegionInfo');
  if (!info) return;
  const rName  = currentLang==='en' ? info.name.en  : info.name.ta;
  const rDesc  = currentLang==='en' ? info.desc.en  : info.desc.ta;
  const rGap   = currentLang==='en' ? info.gap.en   : info.gap.ta;
  const seatsL = currentLang==='en' ? "Total Seats" : "மொத்த இடங்கள்";
  const tallyL = currentLang==='en' ? "Tally"       : "வெற்றிகள்";
  const gapL   = currentLang==='en' ? "Avg Female Turnout Gap" : "சராசரி பாலின வாக்குப்பதிவு இடைவெளி";
  pane.innerHTML = `<strong>${rName}</strong><br>
    ${seatsL}: <strong>${info.seats}</strong><br>
    ${tallyL}: TVK <strong>${info.tvk}</strong> · DMK <strong>${info.dmk}</strong> · AIADMK <strong>${info.aiadmk}</strong><br>
    ${gapL}: <strong>${rGap}</strong><br>
    <p style="font-size:10px;margin-top:4px;font-style:italic;color:gray">${rDesc}</p>`;
}

/* =============================================================
   explorer.js — Constituency search, card details, Leaflet map,
                 SVG region pane
   ============================================================= */

let leafletMap  = null;
let mapMarker   = null;
let geoJsonLayer = null;
const geoJsonFeaturesMap = {};

function getLocalizedConstituencyName(acNo) {
  const keyC = KEY_CONSTITUENCIES[acNo];
  if (currentLang === 'ta') {
    if (keyC) return keyC.name.ta;
    const nameC = CONSTITUENCY_NAMES.find(c => c.ac_no.toString() === acNo);
    if (nameC) return nameC.name.ta;
    
    const bq = BQ_CONSTITUENCY_DATA[acNo];
    if (bq && bq.ac_name) {
      return transliterateToTamil(bq.ac_name, acNo);
    }
    return "தொகுதி " + acNo;
  } else {
    let rawName = "";
    if (keyC) rawName = keyC.name.en;
    else {
      const nameC = CONSTITUENCY_NAMES.find(c => c.ac_no.toString() === acNo);
      if (nameC) rawName = nameC.name.en;
      else {
        const bq = BQ_CONSTITUENCY_DATA[acNo];
        if (bq && bq.ac_name) rawName = bq.ac_name;
      }
    }
    if (rawName) {
      return rawName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    return "Constituency " + acNo;
  }
}

function populateDistrictDropdown() {
  const distBox = document.getElementById('districtSelect');
  if (!distBox) return;

  const currentDist = distBox.value || "ALL";
  distBox.innerHTML = '';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = "ALL";
  defaultOpt.textContent = currentLang === 'ta' ? "அனைத்து 38 மாவட்டங்கள்" : "All 38 Districts";
  distBox.appendChild(defaultOpt);

  const districts = new Set();
  for (let i = 1; i <= 234; i++) {
    const acNo = i.toString();
    const bq = typeof BQ_CONSTITUENCY_DATA !== 'undefined' ? BQ_CONSTITUENCY_DATA[acNo] : null;
    if (bq && bq.district) {
      districts.add(bq.district);
    }
  }

  const sortedDistricts = Array.from(districts).sort();
  sortedDistricts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    distBox.appendChild(opt);
  });

  if (currentDist && distBox.querySelector(`option[value="${currentDist}"]`)) {
    distBox.value = currentDist;
  }
}

function filterConstituenciesByDistrict(selectedDistrict) {
  const selectBox = document.getElementById('constituencySelect');
  if (!selectBox) return;

  const currentVal = selectBox.value;
  selectBox.innerHTML = "";

  for (let i = 1; i <= 234; i++) {
    const acNo = i.toString();
    const bq = typeof BQ_CONSTITUENCY_DATA !== 'undefined' ? BQ_CONSTITUENCY_DATA[acNo] : null;
    const distName = bq ? bq.district : "";

    if (!selectedDistrict || selectedDistrict === "ALL" || distName === selectedDistrict) {
      const opt = document.createElement('option');
      opt.value = acNo;
      opt.textContent = getLocalizedConstituencyName(acNo) + ((!selectedDistrict || selectedDistrict === "ALL") && distName ? ` (${distName})` : "");
      selectBox.appendChild(opt);
    }
  }

  if (currentVal && selectBox.querySelector(`option[value="${currentVal}"]`)) {
    selectBox.value = currentVal;
  } else if (selectBox.options.length > 0) {
    selectBox.value = selectBox.options[0].value;
  }

  if (selectBox.value) {
    loadConstituencyDetails(selectBox.value);
  }
}

function populateConstituencyDropdown() {
  populateDistrictDropdown();
  const distBox = document.getElementById('districtSelect');
  const selectedDistrict = distBox ? distBox.value : "ALL";
  filterConstituenciesByDistrict(selectedDistrict);
}

function filterConstituencySearch(val) {
  const box = document.getElementById('searchSuggestions');
  box.innerHTML = "";
  if (!val || val.length < 2) { box.style.display = "none"; return; }

  const cleanedVal = val.toUpperCase().trim();
  const matches = [];

  for (let i = 1; i <= 234; i++) {
    const acNo = i.toString();
    const localizedName = getLocalizedConstituencyName(acNo).toUpperCase();
    if (localizedName.includes(cleanedVal) || acNo === cleanedVal) {
      matches.push({
        ac_no: acNo,
        name: getLocalizedConstituencyName(acNo)
      });
    }
  }

  if (matches.length === 0) {
    box.innerHTML = `<div style="padding:8px;color:gray;font-style:italic">No results</div>`;
    box.style.display = "block";
    return;
  }

  matches.slice(0, 8).forEach(c => {
    const d = document.createElement('div');
    d.style.cssText = "padding:8px;cursor:pointer;border-bottom:1px solid var(--paper-bg-darker)";
    
    // Find district if available
    const bq = BQ_CONSTITUENCY_DATA[c.ac_no];
    const distName = bq ? bq.district : "";
    
    d.innerHTML = `<strong>${c.name}</strong> (AC ${c.ac_no})${distName ? ' — <span style="font-size:10px">' + distName + '</span>' : ''}`;
    d.onmouseover = () => d.style.background = "var(--paper-bg-darker)";
    d.onmouseout  = () => d.style.background = "none";
    d.onclick = () => {
      box.style.display = "none";
      document.getElementById('constituencySearch').value = c.name;
      const selectBox = document.getElementById('constituencySelect');
      if (selectBox) selectBox.value = c.ac_no;
      loadConstituencyDetails(c.ac_no);
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

  const winnerDisplayName = (function(n) {
    if (!n) return "";
    let s = n.trim();
    ["AIADMK", "DMK", "TVK", "INC", "BJP", "PMK", "DMDK", "VCK", "CPI(M)", "CPI", "IUML", "AMMK", "NTK", "IND"].forEach(p => {
      s = s.replace(new RegExp(`\\s+${p}$`, 'i'), '');
    });
    return s;
  })(data.winner_name);

  const runnerDisplayName = (function(n) {
    if (!n) return "";
    let s = n.trim();
    ["AIADMK", "DMK", "TVK", "INC", "BJP", "PMK", "DMDK", "VCK", "CPI(M)", "CPI", "IUML", "AMMK", "NTK", "IND"].forEach(p => {
      s = s.replace(new RegExp(`\\s+${p}$`, 'i'), '');
    });
    return s;
  })(data.runner_up_name);

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
          ${winnerDisplayName}
          <span class="party-tag" style="background:${winnerColor};display:inline-flex;align-items:center;">${typeof getPartyFlagHtml === 'function' ? getPartyFlagHtml(data.winner_party, "width:14px;height:9px;object-fit:cover;margin-right:4px;vertical-align:middle;") : ""}${data.winner_party}</span>
          ${governmentBadge}
        </div>
        <div style="font-size:12px;margin-top:5px;font-family:'Courier Prime',monospace">
          ${L.votes}: <strong>${data.winner_votes.toLocaleString()}</strong> (${((data.winner_votes/data.total_votes)*100).toFixed(2)}%)
        </div>
      </div>
      <div>
        <div class="section-head"><span>${L.runner}</span></div>
        <div style="font-size:16px;font-weight:700">
          ${runnerDisplayName}
          <span class="party-tag" style="background:${runnerColor};display:inline-flex;align-items:center;">${typeof getPartyFlagHtml === 'function' ? getPartyFlagHtml(data.runner_up_party, "width:14px;height:9px;object-fit:cover;margin-right:4px;vertical-align:middle;") : ""}${data.runner_up_party}</span>
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
    </table>
    
    <!-- FULL CONSTITUENCY ELECTION RESULTS TABLE CONTAINER -->
    <div id="fullResultsContainer" style="margin-top:24px;"></div>`;

  // ── Render Full Results Table ──
  fetchAndRenderFullResultsTable(id);

  // ── Render the 4 extra panels (History, Profile, NTK, Chart) ──
  if (typeof renderExplorerPanels === 'function') {
    setTimeout(() => renderExplorerPanels(id, data), 50);
  }

  // Leaflet map focus
  if (leafletMap) {
    if (window.TN_GEOJSON && geoJsonFeaturesMap[parseInt(id)]) {
      const layer = geoJsonFeaturesMap[parseInt(id)];
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
    const container = document.getElementById('leafletMap');
    if (!container) return;

    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
    }

    leafletMap = L.map('leafletMap', {
      zoomControl: true,
      attributionControl: false,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
      maxZoom: 12
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      opacity: 0.35
    }).addTo(leafletMap);

    const tnBounds = L.latLngBounds(
      L.latLng(7.8, 76.0),
      L.latLng(13.6, 80.6)
    );
    leafletMap.fitBounds(tnBounds, { padding: [5, 5] });
    leafletMap.setMaxBounds(tnBounds.pad(0.08));

    if (window.TN_GEOJSON) {
      geoJsonLayer = L.geoJSON(window.TN_GEOJSON, {
        style: function(feature) {
          const acNoStr = (feature.properties.AC_NO || feature.properties.ac_no || "").toString();
          const cData = getConstituencyData(acNoStr);
          const pColors = {
            "TVK":    "#d4a72c",
            "DMK":    "#c0001a",
            "AIADMK": "#277239",
            "INC":    "#2c7da0",
            "BJP":    "#e67e22",
            "PMK":    "#f39c12",
            "VCK":    "#6b3f87",
            "IUML":   "#0d6b45",
            "DMDK":   "#dd0000",
            "AMMK":   "#006600",
            "Others": "#706757"
          };
          return {
            fillColor: (cData && pColors[cData.winner_party]) || "#706757",
            fillOpacity: 0.85,
            weight: 0.7,
            color: '#2b2318',
            opacity: 0.95
          };
        },
        onEachFeature: function(feature, layer) {
          const acNo = feature.properties.AC_NO || feature.properties.ac_no;
          const cName = feature.properties.AC_NAME || feature.properties.ac_name;
          if (acNo) geoJsonFeaturesMap[acNo] = layer;
          layer.on({
            mouseover: e => {
              e.target.setStyle({ weight: 2.2, color: '#ffffff', fillOpacity: 0.95 });
              e.target.bringToFront();
            },
            mouseout: e => {
              if (geoJsonLayer) geoJsonLayer.resetStyle(e.target);
            },
            click: () => {
              switchTab('explorer');
              const selectBox = document.getElementById('constituencySelect');
              if (selectBox && acNo) {
                selectBox.value = acNo.toString();
                loadConstituencyDetails(acNo.toString());
              }
            }
          });
        }
      }).addTo(leafletMap);
    }
  } catch(e) {
    console.error("Leaflet mini map load failed:", e);
  }
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

/* ── 🗳️ FULL CONSTITUENCY ELECTION RESULTS TABLE ── */
async function fetchAndRenderFullResultsTable(acNo) {
  const container = document.getElementById('fullResultsContainer');
  if (!container) return;

  const L = {
    title: currentLang === 'ta' ? "🗳️ முழு தேர்தல் முடிவுகள் அட்டவணை" : "🗳️ Full Constituency Result Table",
    subtitle: currentLang === 'ta' ? "அனைத்து வேட்பாளர்களின் பெற்ற வாக்குகள், வாக்கு % மற்றும் நிலை விபரம்" : "Complete contesting candidates breakdown, alliances, ballot returns, and vote shares",
    pos: currentLang === 'ta' ? "இடம்" : "Position",
    candidate: currentLang === 'ta' ? "வேட்பாளர்" : "Candidate",
    party: currentLang === 'ta' ? "கட்சி / கூட்டணி" : "Party & Alliance",
    votes: currentLang === 'ta' ? "பெற்ற வாக்குகள் (EVM + தபால்)" : "Votes (EVM + Postal)",
    share: currentLang === 'ta' ? "வாக்கு %" : "Vote %",
    status: currentLang === 'ta' ? "நிலை" : "Status",
    winner: currentLang === 'ta' ? "🏆 வெற்றியாளர்" : "🏆 Winner",
    runner: currentLang === 'ta' ? "இரண்டாம் இடம்" : "Runner-up",
    third: currentLang === 'ta' ? "3-ஆம் இடம்" : "3rd Place",
    nota: currentLang === 'ta' ? "நோட்டா" : "NOTA",
    depositLost: currentLang === 'ta' ? "வைப்புத்தொகை இழப்பு" : "Deposit Lost",
    contested: currentLang === 'ta' ? "போட்டியிட்டவர்" : "Contested",
    loading: currentLang === 'ta' ? "முடிவுகள் பதிவேற்றப்படுகின்றன..." : "Loading candidate results..."
  };

  container.innerHTML = `
    <div class="section-head" style="margin-top:24px; display:flex; justify-content:space-between; align-items:center;">
      <span>${L.title}</span>
      <span class="section-head-subtitle">${L.subtitle}</span>
    </div>
    <div style="font-size:11px; padding:16px; text-align:center; color:var(--ink-gray); font-style:italic;">
      <i class="fa-solid fa-spinner fa-spin"></i> ${L.loading}
    </div>
  `;

  let candidates = [];
  try {
    const res = await fetch(`/api/results/${acNo}`);
    if (res.ok) {
      const data = await res.json();
      candidates = data.candidates || [];
    }
  } catch (e) {
    console.warn("API results fetch failed, trying local JSON fallback", e);
  }

  if (!candidates || candidates.length === 0) {
    try {
      const res = await fetch('/data/results_2026.json');
      if (res.ok) {
        const allData = await res.json();
        candidates = allData[acNo] || allData[String(acNo)] || [];
      }
    } catch (e) {
      console.error("Local results JSON fetch failed", e);
    }
  }

  if (!candidates || candidates.length === 0) {
    container.innerHTML = `
      <div class="section-head" style="margin-top:24px;"><span>${L.title}</span></div>
      <div style="font-size:11px; padding:12px; color:var(--ink-gray);">No candidate result records found for AC ${acNo}.</div>
    `;
    return;
  }

  const pColors = { 
    "TVK": "#d30d25", "DMK": "#242424", "AIADMK": "#12702c", "INC": "#0b407a", 
    "BJP": "#f97316", "NTK": "#b91c1c", "PMK": "#ca8a04", "VCK": "#7c3aed", 
    "DMDK": "#d97706", "IUML": "#047857", "AMMK": "#c026d3", "CPI": "#dc2626", "CPI(M)": "#b91c1c"
  };

  const rowsHtml = candidates.map(c => {
    const isWinner = c.rank === 1;
    const isRunner = c.rank === 2;
    const isThird  = c.rank === 3;
    const isNota   = (c.party && c.party.toUpperCase().includes("NONE OF THE ABOVE")) || (c.candidate && c.candidate.toUpperCase() === "NOTA");
    const depositLost = !isWinner && !isRunner && !isThird && !isNota && c.pct_votes < 16.67;

    let statusText = L.contested;
    let statusClass = "status-badge-neutral";
    if (isWinner) {
      statusText = L.winner;
      statusClass = "status-badge-winner";
    } else if (isRunner) {
      statusText = L.runner;
      statusClass = "status-badge-runner";
    } else if (isThird) {
      statusText = L.third;
      statusClass = "status-badge-third";
    } else if (isNota) {
      statusText = L.nota;
      statusClass = "status-badge-nota";
    } else if (depositLost) {
      statusText = L.depositLost;
      statusClass = "status-badge-lost";
    }

    const partyColor = pColors[c.party] || "var(--ink-charcoal)";
    const flagHtml = (typeof getPartyFlagHtml === 'function') 
      ? getPartyFlagHtml(c.party, "width:14px;height:9px;object-fit:cover;margin-right:4px;vertical-align:middle;") 
      : "";

    const trStyle = isWinner 
      ? "background: rgba(254, 243, 199, 0.4); font-weight:700;" 
      : (isRunner ? "background: rgba(243, 244, 246, 0.4);" : "");

    const rankBadgeClass = isWinner ? "rank-badge winner-rank" : (isRunner ? "rank-badge runner-rank" : "rank-badge");

    const totalVotesFormatted = (c.total_votes || 0).toLocaleString();
    const evmFormatted = (c.evm_votes || 0).toLocaleString();
    const postalFormatted = (c.postal_votes || 0).toLocaleString();

    return `
      <tr style="${trStyle}">
        <td class="text-center" style="width:50px;">
          <span class="${rankBadgeClass}">${c.rank}</span>
        </td>
        <td>
          <strong style="color:var(--ink-charcoal); font-size:12px;">${c.candidate}</strong>
        </td>
        <td>
          <span class="party-tag" style="background:${partyColor}; display:inline-flex; align-items:center; font-size:10px; padding:2px 6px;">
            ${flagHtml}${c.party}
          </span>
          ${c.alliance && c.alliance !== '-' ? `<span style="font-size:9px; color:var(--ink-gray); margin-left:4px;">(${c.alliance})</span>` : ''}
        </td>
        <td class="text-right" style="font-family:'Courier Prime',monospace; font-size:11px;">
          <strong>${totalVotesFormatted}</strong>
          <div style="font-size:8px; color:var(--ink-light);" title="EVM: ${evmFormatted} | Postal: ${postalFormatted}">
            EVM: ${evmFormatted} · Postal: ${postalFormatted}
          </div>
        </td>
        <td class="text-right" style="width:130px; font-family:'Courier Prime',monospace;">
          <strong>${c.pct_votes}%</strong>
          <div class="result-vote-track" style="height:4px; background:#e5e7eb; border-radius:2px; margin-top:2px; overflow:hidden;">
            <div style="width:${Math.min(c.pct_votes, 100)}%; height:100%; background:${partyColor};"></div>
          </div>
        </td>
        <td class="text-center" style="width:110px;">
          <span class="${statusClass}">${statusText}</span>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="section-head" style="margin-top:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span>${L.title}</span>
      <span class="section-head-subtitle">${L.subtitle}</span>
    </div>
    <div class="table-responsive" style="overflow-x:auto;">
      <table class="np-table np-table-results" style="font-size:11px; width:100%; border-collapse:collapse; margin-top:8px;">
        <thead>
          <tr>
            <th class="text-center" style="width:50px;">${L.pos}</th>
            <th>${L.candidate}</th>
            <th>${L.party}</th>
            <th class="text-right">${L.votes}</th>
            <th class="text-right">${L.share}</th>
            <th class="text-center">${L.status}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

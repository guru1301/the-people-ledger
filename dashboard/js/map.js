/* =============================================================
   map.js — Statewide electoral GeoJSON map (Map Explorer tab)
   ============================================================= */

let statewideMapInstance  = null;
let statewideGeoJsonLayer = null;

function initStatewideMap() {
  try {
    if (!window.TN_GEOJSON) { console.log("GeoJSON data not loaded!"); return; }

    statewideMapInstance = L.map('statewideMap', { zoomControl: true, attributionControl: false }).setView([11.1271, 78.6569], 7);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(statewideMapInstance);

    /*
      Premium party map palette — sourced from actual party flags:
        TVK   : Deep crimson red  (#C8001A)  — dominant red of TVK flag
        DMK   : Rich charcoal black (#1a1a1a) — dominant black of DMK flag
        AIADMK: Forest green      (#1a7c30)  — AIADMK's signature green
        INC   : Congress blue     (#1952a0)
        VCK   : Viduthalai purple (#6b3f87)
        IUML  : Islamic green     (#0d6b45)
        Others: Warm slate        (#5c5040)
    */
    const pColors = {
      "TVK":    "url(#grad-tvk)",
      "DMK":    "url(#grad-dmk)",
      "AIADMK": "url(#grad-aiadmk)",
      "INC":    "url(#grad-inc)",
      "VCK":    "url(#grad-vck)",
      "IUML":   "url(#grad-iuml)",
      "Others": "url(#grad-other)"
    };

    /* Lighter highlight shades shown on hover (flag accent colors) */
    const pHover = {
      "TVK":    "#ff1a2e",   /* TVK yellow accent → use bright red flash */
      "DMK":    "#c8001a",   /* DMK red accent on hover */
      "AIADMK": "#26b845",   /* AIADMK bright green */
      "INC":    "#2876d4",
      "VCK":    "#9b5fc7",
      "IUML":   "#1aad6b",
      "Others": "#8a7560"
    };


    statewideGeoJsonLayer = L.geoJSON(window.TN_GEOJSON, {
      style: function(feature) {
        const cData = getConstituencyData(feature.properties.AC_NO.toString());
        const party = cData ? cData.winner_party : 'Others';
        return {
          fillColor: pColors[party] || pColors['Others'],
          weight: 0.5,
          opacity: 1,
          color: 'rgba(255,255,255,0.25)',
          fillOpacity: 0.88
        };
      },

      onEachFeature: function(feature, layer) {
        const acNo  = feature.properties.AC_NO;
        const cName = feature.properties.AC_NAME;

        layer.on({
          mouseover: function(e) {
            const cData = getConstituencyData(acNo.toString());
            const party = cData ? cData.winner_party : 'Others';
            e.target.setStyle({
              weight: 2.5,
              color: '#ffffff',
              fillColor: pHover[party] || '#8a7560',
              fillOpacity: 1
            });
            e.target.bringToFront();
            if (cData) {
              let allianceText = "TVK Coalition";
              if      (cData.winner_party === "DMK")    allianceText = "DMK+";
              else if (cData.winner_party === "AIADMK") allianceText = "ADMK+";
              else if (!["TVK","INC","VCK","IUML"].includes(cData.winner_party)) allianceText = "Others";
              if (currentLang === 'ta') {
                if      (allianceText === "TVK Coalition") allianceText = "டிவிேக கூட்டணி";
                else if (allianceText === "DMK+")          allianceText = "திமுக+";
                else if (allianceText === "ADMK+")         allianceText = "அதிமுக+";
                else                                       allianceText = "மற்றவர்கள்";
              }
              const hoverBox = document.getElementById('mapHoverBox');
              document.getElementById('mapHoverTitle').textContent     = `${cData.ac_no.toString().padStart(3,'0')} | ${cData.name.toUpperCase()}`;
              document.getElementById('mapHoverCandidate').textContent = cData.winner_name;
              document.getElementById('mapHoverParty').textContent     = cData.winner_party;
              document.getElementById('mapHoverAlliance').textContent  = allianceText;
              document.getElementById('mapHoverVotes').textContent     = cData.winner_votes.toLocaleString();
              document.getElementById('mapHoverMargin').textContent    = cData.margin.toLocaleString();
              hoverBox.style.display = "block";
            }
          },
          mouseout: function(e) {
            statewideGeoJsonLayer.resetStyle(e.target);
            document.getElementById('mapHoverBox').style.display = "none";
          },
          click: function() {
            switchTab('explorer');
            const selectBox = document.getElementById('constituencySelect');
            let exists = false;
            for (let i = 0; i < selectBox.options.length; i++) if (selectBox.options[i].value === acNo.toString()) { exists = true; break; }
            if (!exists) {
              const opt = document.createElement('option');
              opt.value = acNo.toString();
              const cData = getConstituencyData(acNo.toString());
              opt.textContent = (cData ? cData.name : cName) + ` (AC ${acNo})`;
              selectBox.appendChild(opt);
            }
            selectBox.value = acNo.toString();
            loadConstituencyDetails(acNo.toString());
          }
        });
      }
    }).addTo(statewideMapInstance);

  } catch(err) { console.log("Statewide map load failed:", err); }
}

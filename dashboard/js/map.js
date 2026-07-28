/* =============================================================
   map.js — Statewide electoral GeoJSON map (Map Explorer tab)
   Vintage Newspaper Cartographic Theme · Tamil Nadu GeoJSON
   ============================================================= */

let statewideMapInstance  = null;
let statewideGeoJsonLayer = null;

const PARTY_MAP_COLORS = {
  "TVK":    "#d4a72c",  // Rich Gold
  "DMK":    "#c0001a",  // Deep Crimson Red
  "AIADMK": "#277239",  // Forest Green
  "INC":    "#2c7da0",  // Congress Blue
  "BJP":    "#e67e22",  // Deep Saffron
  "PMK":    "#f39c12",  // Amber
  "VCK":    "#6b3f87",  // Royal Purple
  "IUML":   "#0d6b45",  // Islamic Emerald
  "DMDK":   "#dd0000",  // Red
  "AMMK":   "#006600",  // Green
  "Others": "#706757"   // Vintage Slate
};

const PARTY_HOVER_COLORS = {
  "TVK":    "#f3c644",
  "DMK":    "#e61a35",
  "AIADMK": "#35a052",
  "INC":    "#419bc7",
  "BJP":    "#f39c12",
  "PMK":    "#f1c40f",
  "VCK":    "#8e59b3",
  "IUML":   "#159d66",
  "Others": "#8d8372"
};

function initStatewideMap() {
  try {
    if (!window.TN_GEOJSON) {
      console.log("GeoJSON data not loaded!");
      return;
    }

    const container = document.getElementById('statewideMap');
    if (!container) return;

    // Clean up existing map instance if re-initialized
    if (statewideMapInstance) {
      statewideMapInstance.remove();
      statewideMapInstance = null;
    }

    // Initialize Leaflet Map focused strictly on Tamil Nadu
    statewideMapInstance = L.map('statewideMap', {
      zoomControl: true,
      attributionControl: false,
      maxBoundsViscosity: 1.0,
      minZoom: 6,
      maxZoom: 12
    });

    // Warm Parchment Carto Basemap (Subtle & Vintage)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      opacity: 0.35
    }).addTo(statewideMapInstance);

    // Strict Tamil Nadu Geographic Bounding Box (Only Tamil Nadu visible)
    const tnBounds = L.latLngBounds(
      L.latLng(7.8, 76.0),   // Kanyakumari South-West
      L.latLng(13.6, 80.6)   // Tiruvallur/Chennai North-East
    );

    statewideMapInstance.fitBounds(tnBounds, { padding: [10, 10] });
    statewideMapInstance.setMaxBounds(tnBounds.pad(0.08));

    // Render Tamil Nadu Assembly Constituencies GeoJSON Layer
    statewideGeoJsonLayer = L.geoJSON(window.TN_GEOJSON, {
      style: function(feature) {
        const acNoStr = (feature.properties.AC_NO || feature.properties.ac_no || "").toString();
        const cData = getConstituencyData(acNoStr);
        const party = cData ? cData.winner_party : 'Others';
        return {
          fillColor: PARTY_MAP_COLORS[party] || PARTY_MAP_COLORS['Others'],
          fillOpacity: 0.85,
          weight: 0.8,
          color: '#2b2318',  // Vintage Sepia Ink border
          opacity: 0.95
        };
      },

      onEachFeature: function(feature, layer) {
        const acNo = feature.properties.AC_NO || feature.properties.ac_no;
        const cName = feature.properties.AC_NAME || feature.properties.ac_name;

        layer.on({
          mouseover: function(e) {
            const cData = getConstituencyData(acNo.toString());
            const party = cData ? cData.winner_party : 'Others';
            e.target.setStyle({
              weight: 2.5,
              color: '#ffffff',
              fillColor: PARTY_HOVER_COLORS[party] || '#8d8372',
              fillOpacity: 1.0
            });
            e.target.bringToFront();

            if (cData) {
              let allianceText = "TVK Coalition";
              if      (cData.winner_party === "DMK")    allianceText = "DMK+";
              else if (cData.winner_party === "AIADMK") allianceText = "ADMK+";
              else if (!["TVK","INC","VCK","IUML"].includes(cData.winner_party)) allianceText = "Others";
              if (typeof currentLang !== 'undefined' && currentLang === 'ta') {
                if      (allianceText === "TVK Coalition") allianceText = "டிவிேக கூட்டணி";
                else if (allianceText === "DMK+")          allianceText = "திமுக+";
                else if (allianceText === "ADMK+")         allianceText = "அதிமுக+";
                else                                       allianceText = "மற்றவர்கள்";
              }

              const hoverBox = document.getElementById('mapHoverBox');
              if (hoverBox) {
                document.getElementById('mapHoverTitle').textContent     = `${cData.ac_no.toString().padStart(3,'0')} | ${cData.name}`;
                document.getElementById('mapHoverCandidate').textContent = cData.winner_name;
                document.getElementById('mapHoverParty').textContent     = cData.winner_party;
                document.getElementById('mapHoverAlliance').textContent  = allianceText;
                document.getElementById('mapHoverVotes').textContent     = cData.winner_votes.toLocaleString();
                document.getElementById('mapHoverMargin').textContent    = cData.margin.toLocaleString();
                hoverBox.style.display = "block";
              }
            }
          },

          mouseout: function(e) {
            statewideGeoJsonLayer.resetStyle(e.target);
            const hoverBox = document.getElementById('mapHoverBox');
            if (hoverBox) hoverBox.style.display = "none";
          },

          click: function() {
            switchTab('explorer');
            const selectBox = document.getElementById('constituencySelect');
            if (selectBox) {
              let exists = false;
              for (let i = 0; i < selectBox.options.length; i++) {
                if (selectBox.options[i].value === acNo.toString()) { exists = true; break; }
              }
              if (!exists) {
                const opt = document.createElement('option');
                opt.value = acNo.toString();
                const cData = getConstituencyData(acNo.toString());
                opt.textContent = cData ? cData.name : cName;
                selectBox.appendChild(opt);
              }
              selectBox.value = acNo.toString();
              loadConstituencyDetails(acNo.toString());
            }
          }
        });
      }
    }).addTo(statewideMapInstance);

  } catch(err) {
    console.error("Statewide map load failed:", err);
  }
}

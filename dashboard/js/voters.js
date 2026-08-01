/* =============================================================
   voters.js — Official ECI Statistical Archive of Tamil Nadu's Electorate
   ============================================================= */

const voterArchiveModule = (function() {
  // Module State
  let overviewData = null;
  let districtLedgerData = [];
  let currentSortCol = 'district';
  let sortAscending = true;
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 10;
  
  // Chart instances for responsive destroying & redrawing
  let chartInstances = {};

  // Helper to format numbers safely
  function fmt(val) {
    if (val === undefined || val === null || isNaN(val)) return '--';
    return Number(val).toLocaleString();
  }

  function fmtPct(val) {
    if (val === undefined || val === null || isNaN(val)) return '--%';
    return Number(val).toFixed(2) + '%';
  }

  // Safe DOM element text setter
  function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = (val !== undefined && val !== null) ? val : '--';
  }

  // Safe DOM element HTML setter
  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // Safe Fetch Wrapper to handle host/port/file scheme variations
  async function safeFetch(path) {
    try {
      let resp = await fetch(path);
      if (resp && resp.ok) return resp;
      if (window.location.protocol === 'file:' || !window.location.host.includes(':8000')) {
        resp = await fetch('http://localhost:8000' + path);
        if (resp && resp.ok) return resp;
      }
    } catch (err) {
      if (window.location.protocol === 'file:' || !window.location.host.includes(':8000')) {
        try {
          let resp = await fetch('http://localhost:8000' + path);
          if (resp && resp.ok) return resp;
        } catch (err2) {
          console.warn('safeFetch fallback error for', path, err2);
        }
      }
    }
    return null;
  }

  // Generic Table Renderer (Passes item and index)
  function renderTableBody(targetId, list, rowHtmlFn) {
    const tbody = document.getElementById(targetId);
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:15px; font-style:italic">No records available.</td></tr>`;
      return;
    }
    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = rowHtmlFn(item, idx);
      tbody.appendChild(tr);
    });
  }

  // -------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------
  function init() {
    console.log("Initializing Official Voter Archive Module...");
    loadHeroOverview();
    loadDistrictLedger();
    loadExtremesTables();
    loadGenderStats();
    loadPostalStats();
    loadTurnoutDistribution();
    loadDistrictCards();
    loadQuickFactsAndCharts();
  }

  // -------------------------------------------------------------
  // SECTION 1: HERO OVERVIEW STATS
  // -------------------------------------------------------------
  async function loadHeroOverview() {
    try {
      const resp = await safeFetch('/api/voters/overview');
      if (!resp) return;
      const data = await resp.json();
      overviewData = data;

      setTxt('voter-hero-electors', fmt(data.registered_electors));
      setTxt('voter-hero-voted', fmt(data.votes_cast));
      setTxt('voter-hero-turnout', fmtPct(data.overall_turnout_pct));
      setTxt('voter-hero-male', fmt(data.male_electors));
      setTxt('voter-hero-female', fmt(data.female_electors));
      setTxt('voter-hero-tg', fmt(data.third_gender_electors));
      setTxt('voter-hero-acs', data.assembly_constituencies || 234);
      setTxt('voter-hero-districts', data.districts || 38);
    } catch (e) {
      console.error("Failed to load hero overview:", e);
    }
  }

  // -------------------------------------------------------------
  // SECTION 2: 38-DISTRICT ELECTOR LEDGER
  // -------------------------------------------------------------
  async function loadDistrictLedger() {
    try {
      const resp = await safeFetch('/api/voters/districts');
      if (!resp) return;
      districtLedgerData = await resp.json();
      renderDistrictLedger();
    } catch (e) {
      console.error("Failed to load district ledger:", e);
    }
  }

  function renderDistrictLedger() {
    const tbody = document.getElementById('districtLedgerBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let filtered = districtLedgerData.filter(d => {
      const q = searchQuery.toLowerCase().trim();
      return !q || d.district.toLowerCase().includes(q);
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[currentSortCol];
      let valB = b[currentSortCol];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAscending ? -1 : 1;
      if (valA > valB) return sortAscending ? 1 : -1;
      return 0;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:gray; font-style:italic">No matching district records found.</td></tr>`;
    } else {
      pageItems.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="strong"><a href="javascript:void(0)" onclick="voterArchiveModule.openDistrictModal('${d.district}')" style="color:var(--ink-charcoal); text-decoration:underline">${d.district}</a></td>
          <td class="text-right">${d.assembly_seats}</td>
          <td class="text-right font-mono">${fmt(d.registered_electors)}</td>
          <td class="text-right font-mono">${fmt(d.male)}</td>
          <td class="text-right font-mono">${fmt(d.female)}</td>
          <td class="text-right font-mono">${fmt(d.third_gender)}</td>
          <td class="text-right font-mono">${fmt(d.votes_cast)}</td>
          <td class="text-right font-mono strong" style="color:var(--ink-red)">${fmtPct(d.turnout_pct)}</td>
        `;
        tbody.appendChild(row);
      });
    }

    renderPaginationControls('district-ledger-pagination', currentPage, totalPages, filtered.length);
  }

  function renderPaginationControls(containerId, curr, total, totalRecords) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div>Showing ${totalRecords > 0 ? (curr - 1) * itemsPerPage + 1 : 0} to ${Math.min(curr * itemsPerPage, totalRecords)} of ${totalRecords} Districts</div>
      <div style="display:flex; gap:6px">
        <button onclick="voterArchiveModule.changePage(-1)" class="vintage-btn-sm" ${curr <= 1 ? 'disabled' : ''}>&laquo; Prev</button>
        <span style="padding:4px 8px; font-weight:700">Page ${curr} of ${total}</span>
        <button onclick="voterArchiveModule.changePage(1)" class="vintage-btn-sm" ${curr >= total ? 'disabled' : ''}>Next &raquo;</button>
      </div>
    `;
  }

  function changePage(delta) {
    currentPage += delta;
    renderDistrictLedger();
  }

  function filterDistrictLedger(query) {
    searchQuery = query;
    currentPage = 1;
    renderDistrictLedger();
  }

  function sortDistrictLedger(col) {
    if (currentSortCol === col) sortAscending = !sortAscending;
    else { currentSortCol = col; sortAscending = true; }
    renderDistrictLedger();
  }

  function exportDistrictLedgerCSV() {
    let csv = "District,Assembly Seats,Registered Electors,Male Electors,Female Electors,Third Gender Electors,Votes Cast,Turnout %\n";
    districtLedgerData.forEach(d => {
      csv += `"${d.district}",${d.assembly_seats},${d.registered_electors},${d.male},${d.female},${d.third_gender},${d.votes_cast},${d.turnout_pct}\n`;
    });
    downloadFile(csv, "Tamil_Nadu_ECI_38_District_Voter_Ledger_2026.csv", "text/csv");
  }

  function exportDistrictLedgerExcel() {
    let xml = `<table border="1"><tr><th>District</th><th>Seats</th><th>Total Electors</th><th>Male</th><th>Female</th><th>Third Gender</th><th>Votes Cast</th><th>Turnout %</th></tr>`;
    districtLedgerData.forEach(d => {
      xml += `<tr><td>${d.district}</td><td>${d.assembly_seats}</td><td>${d.registered_electors}</td><td>${d.male}</td><td>${d.female}</td><td>${d.third_gender}</td><td>${d.votes_cast}</td><td>${d.turnout_pct}%</td></tr>`;
    });
    xml += `</table>`;
    downloadFile(xml, "Tamil_Nadu_ECI_38_District_Voter_Ledger_2026.xls", "application/vnd.ms-excel");
  }

  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType + ';charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // -------------------------------------------------------------
  // SECTIONS 3, 4, 5, 6: EXTREMES TABLES
  // -------------------------------------------------------------
  async function loadExtremesTables() {
    try {
      const [f1, f2, f3, f4] = await Promise.all([
        safeFetch('/api/voters/largest-electorates?limit=20').then(r => r ? r.json() : []),
        safeFetch('/api/voters/smallest-electorates?limit=20').then(r => r ? r.json() : []),
        safeFetch('/api/voters/top-turnout?limit=20').then(r => r ? r.json() : []),
        safeFetch('/api/voters/lowest-turnout?limit=20').then(r => r ? r.json() : [])
      ]);

      renderTableBody('largestElectoratesBody', f1, item => `
        <td class="font-mono text-center">${item.rank}</td>
        <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
        <td>${item.district}</td>
        <td class="text-right font-mono strong">${fmt(item.registered_electors)}</td>
        <td class="text-right font-mono">${fmtPct(item.turnout_pct)}</td>
      `);

      renderTableBody('smallestElectoratesBody', f2, item => `
        <td class="font-mono text-center">${item.rank}</td>
        <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
        <td>${item.district}</td>
        <td class="text-right font-mono strong">${fmt(item.registered_electors)}</td>
        <td class="text-right font-mono">${fmtPct(item.turnout_pct)}</td>
      `);

      renderTableBody('topTurnoutBody', f3, item => `
        <td class="font-mono text-center">${item.rank}</td>
        <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
        <td>${item.district}</td>
        <td class="text-right font-mono strong" style="color:var(--ink-red)">${fmtPct(item.turnout_pct)}</td>
        <td class="text-right font-mono">${fmt(item.votes_cast)}</td>
      `);

      renderTableBody('lowestTurnoutBody', f4, item => `
        <td class="font-mono text-center">${item.rank}</td>
        <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
        <td>${item.district}</td>
        <td class="text-right font-mono strong">${fmtPct(item.turnout_pct)}</td>
        <td class="text-right font-mono">${fmt(item.votes_cast)}</td>
      `);
    } catch (e) {
      console.error("Failed to load extremes tables:", e);
    }
  }

  // -------------------------------------------------------------
  // SECTIONS 7 & 8: GENDER STATS & FEMALE MAJORITY
  // -------------------------------------------------------------
  async function loadGenderStats() {
    try {
      const resp = await safeFetch('/api/voters/gender');
      if (!resp) return;
      const data = await resp.json();

      setTxt('gender-stat-male-pct', fmtPct(data.male_pct));
      setTxt('gender-stat-female-pct', fmtPct(data.female_pct));
      setTxt('gender-stat-tg-pct', fmtPct(data.third_gender_pct));

      if (data.highest_female_elector_pct) {
        setTxt('highest-female-constituency', `${data.highest_female_elector_pct.constituency} (${data.highest_female_elector_pct.percentage}%)`);
      }
      if (data.highest_male_elector_pct) {
        setTxt('highest-male-constituency', `${data.highest_male_elector_pct.constituency} (${data.highest_male_elector_pct.percentage}%)`);
      }
      if (data.highest_third_gender_count) {
        setTxt('highest-tg-constituency', `${data.highest_third_gender_count.constituency} (${data.highest_third_gender_count.count} TG Electors)`);
      }

      setTxt('female-majority-title-count', `Total: ${data.female_majority_count} Constituencies`);

      renderTableBody('femaleMajorityBody', data.female_majority_constituencies, item => `
        <td class="font-mono">${item.ac_no}</td>
        <td class="strong">${item.constituency}</td>
        <td>${item.district}</td>
        <td class="text-right font-mono">${fmt(item.male)}</td>
        <td class="text-right font-mono">${fmt(item.female)}</td>
        <td class="text-right font-mono strong" style="color:var(--ink-green)">+${fmt(item.difference)}</td>
        <td class="text-right font-mono strong">${fmtPct(item.female_pct)}</td>
      `);
    } catch (e) {
      console.error("Failed to load gender stats:", e);
    }
  }

  // -------------------------------------------------------------
  // SECTION 9: POSTAL BALLOT ARCHIVE (RANKING FIX)
  // -------------------------------------------------------------
  async function loadPostalStats() {
    try {
      const resp = await safeFetch('/api/voters/postal');
      if (!resp) return;
      const data = await resp.json();

      setTxt('postal-stat-received', fmt(data.postal_ballots_received));
      setTxt('postal-stat-accepted', fmt(data.accepted));
      setTxt('postal-stat-rejected', fmt(data.rejected));
      setTxt('postal-stat-rejection-pct', fmtPct(data.rejection_pct));

      renderTableBody('topPostalDistrictsBody', data.top_districts, (item, idx) => `
        <td class="font-mono text-center">${idx + 1}</td>
        <td class="strong">${item.district}</td>
        <td class="text-right font-mono strong">${fmt(item.postal_votes)}</td>
      `);
    } catch (e) {
      console.error("Failed to load postal stats:", e);
    }
  }

  // -------------------------------------------------------------
  // SECTION 10: TURNOUT DISTRIBUTION
  // -------------------------------------------------------------
  async function loadTurnoutDistribution() {
    try {
      const resp = await safeFetch('/api/voters/turnout-distribution');
      if (!resp) return;
      const data = await resp.json();

      renderTableBody('turnoutDistributionBody', data.distribution, item => `
        <td class="strong">${item.range}%</td>
        <td class="text-right font-mono strong">${item.constituencies_count}</td>
        <td class="text-right font-mono">${fmtPct(item.percentage)}</td>
      `);

      renderTurnoutDistributionChart(data.distribution);
    } catch (e) {
      console.error("Failed to load turnout distribution:", e);
    }
  }

  function renderTurnoutDistributionChart(distribution) {
    const ctx = document.getElementById('chartTurnoutDistribution');
    if (!ctx || typeof Chart === 'undefined') return;

    if (chartInstances['turnoutDist']) chartInstances['turnoutDist'].destroy();

    const labels = distribution.map(d => d.range + '%');
    const counts = distribution.map(d => d.constituencies_count);

    chartInstances['turnoutDist'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Constituencies',
          data: counts,
          backgroundColor: '#8b0000',
          borderColor: '#111111',
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e0d8c3' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // SECTION 11: SEARCH EXPLORER
  // -------------------------------------------------------------
  let searchDebounceTimer = null;
  function handleSearchExplorer(query) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      executeSearchExplorer(query);
    }, 250);
  }

  async function executeSearchExplorer(query) {
    const container = document.getElementById('searchExplorerResults');
    if (!container) return;
    const q = query.trim();
    if (!q) {
      container.innerHTML = `<p style="font-style:italic; text-align:center; color:gray; padding:20px">Type in the box above to explore detailed constituency electorate metrics...</p>`;
      return;
    }

    try {
      const resp = await safeFetch(`/api/voters/search?q=${encodeURIComponent(q)}`);
      if (!resp) return;
      const results = await resp.json();

      if (results.length === 0) {
        container.innerHTML = `<p style="font-style:italic; text-align:center; color:gray; padding:20px">No matching constituency or district found for "${q}".</p>`;
        return;
      }

      let html = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:12px">`;
      results.forEach(r => {
        html += `
          <div class="voter-search-card">
            <div style="font-family:'Playfair Display',serif; font-weight:900; font-size:15px">${r.constituency} <span style="font-size:11px; font-family:'Courier Prime',monospace; color:gray">(AC ${r.ac_no})</span></div>
            <div style="font-size:11px; color:gray; margin-bottom:8px">District: <strong>${r.district}</strong></div>
            <div class="voter-search-grid">
              <div>Electors: <strong>${fmt(r.registered_electors)}</strong></div>
              <div>Turnout: <strong style="color:var(--ink-red)">${fmtPct(r.turnout_pct)}</strong></div>
              <div>Male: ${fmt(r.male)}</div>
              <div>Female: ${fmt(r.female)}</div>
              <div>Third Gender: ${fmt(r.third_gender)}</div>
              <div>Votes Polled: ${fmt(r.votes_cast)}</div>
              <div>Postal Votes: ${fmt(r.postal_votes)}</div>
              <div>NOTA Votes: ${fmt(r.nota_votes)}</div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      container.innerHTML = html;
    } catch (e) {
      console.error("Search explorer error:", e);
    }
  }

  // -------------------------------------------------------------
  // SECTION 12: INTERACTIVE 38-DISTRICT CARDS & MODAL
  // -------------------------------------------------------------
  async function loadDistrictCards() {
    try {
      const resp = await safeFetch('/api/voters/districts');
      if (!resp) return;
      const districts = await resp.json();

      const grid = document.getElementById('districtCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';

      districts.forEach(d => {
        const card = document.createElement('div');
        card.className = 'district-interactive-card';
        card.onclick = () => openDistrictModal(d.district);
        card.innerHTML = `
          <div class="district-card-title">${d.district}</div>
          <div class="district-card-sub">${d.assembly_seats} Assembly Seats</div>
          <div class="district-card-metrics">
            <div>Electors: <strong>${fmt(d.registered_electors)}</strong></div>
            <div>Turnout: <strong style="color:var(--ink-red)">${fmtPct(d.turnout_pct)}</strong></div>
            <div>Votes Cast: <strong>${fmt(d.votes_cast)}</strong></div>
          </div>
        `;
        grid.appendChild(card);
      });
    } catch (e) {
      console.error("Failed to load district cards:", e);
    }
  }

  async function openDistrictModal(districtName) {
    const modal = document.getElementById('districtModal');
    const title = document.getElementById('districtModalTitle');
    const body = document.getElementById('districtModalBody');
    if (!modal || !body) return;

    modal.style.display = 'flex';
    if (title) title.innerText = `${districtName} District Electorate Profile`;
    body.innerHTML = `<div style="text-align:center; padding:30px; font-style:italic">Loading district details...</div>`;

    try {
      const resp = await safeFetch(`/api/voters/district-detail/${encodeURIComponent(districtName)}`);
      if (!resp) throw new Error("District details failed");
      const d = await resp.json();

      let acRows = '';
      d.constituencies.forEach(ac => {
        acRows += `
          <tr>
            <td class="font-mono">${ac.ac_no}</td>
            <td class="strong">${ac.constituency}</td>
            <td class="text-right font-mono">${fmt(ac.electors)}</td>
            <td class="text-right font-mono">${fmt(ac.votes_cast)}</td>
            <td class="text-right font-mono strong" style="color:var(--ink-red)">${fmtPct(ac.turnout_pct)}</td>
          </tr>
        `;
      });

      body.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:15px; text-align:center">
          <div class="voter-mini-card">
            <div style="font-size:9px; text-transform:uppercase; color:gray">Assembly Seats</div>
            <div style="font-size:16px; font-weight:900">${d.summary.assembly_seats}</div>
          </div>
          <div class="voter-mini-card">
            <div style="font-size:9px; text-transform:uppercase; color:gray">Total Electors</div>
            <div style="font-size:16px; font-weight:900">${fmt(d.summary.registered_electors)}</div>
          </div>
          <div class="voter-mini-card">
            <div style="font-size:9px; text-transform:uppercase; color:gray">Votes Cast</div>
            <div style="font-size:16px; font-weight:900">${fmt(d.summary.votes_cast)}</div>
          </div>
          <div class="voter-mini-card">
            <div style="font-size:9px; text-transform:uppercase; color:gray">Average Turnout</div>
            <div style="font-size:16px; font-weight:900; color:var(--ink-red)">${fmtPct(d.summary.turnout_pct)}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:15px">
          <div style="border:1px solid var(--ink-charcoal); padding:10px; background:var(--paper-bg)">
            <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:6px">District Key Extremes</div>
            <div style="font-size:11px; line-height:1.6">
              <div>Top Turnout: <strong>${d.extremes.top_turnout.constituency} (${fmtPct(d.extremes.top_turnout.turnout_pct)})</strong></div>
              <div>Lowest Turnout: <strong>${d.extremes.lowest_turnout.constituency} (${fmtPct(d.extremes.lowest_turnout.turnout_pct)})</strong></div>
              <div>Largest Electorate: <strong>${d.extremes.largest_electorate.constituency} (${fmt(d.extremes.largest_electorate.electors)})</strong></div>
              <div>Smallest Electorate: <strong>${d.extremes.smallest_electorate.constituency} (${fmt(d.extremes.smallest_electorate.electors)})</strong></div>
            </div>
          </div>
          <div style="border:1px solid var(--ink-charcoal); padding:10px; background:var(--paper-bg); display:flex; flex-direction:column; justify-content:center">
            <canvas id="districtGenderPieChart" style="max-height:130px"></canvas>
          </div>
        </div>

        <div class="np-table-container" style="max-height:220px; border:1px solid var(--ink-charcoal)">
          <table class="np-table">
            <thead>
              <tr>
                <th>AC No</th>
                <th>Constituency</th>
                <th class="text-right">Electors</th>
                <th class="text-right">Votes Cast</th>
                <th class="text-right">Turnout %</th>
              </tr>
            </thead>
            <tbody>${acRows}</tbody>
          </table>
        </div>
      `;

      renderModalGenderPieChart(d.summary.male_electors, d.summary.female_electors, d.summary.third_gender_electors);
    } catch (e) {
      body.innerHTML = `<div style="color:var(--ink-red); text-align:center; padding:20px">Failed to load details for ${districtName}.</div>`;
    }
  }

  function renderModalGenderPieChart(m, f, tg) {
    const ctx = document.getElementById('districtGenderPieChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (chartInstances['modalPie']) chartInstances['modalPie'].destroy();

    chartInstances['modalPie'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female', 'Third Gender'],
        datasets: [{
          data: [m, f, tg],
          backgroundColor: ['#1f4e78', '#8b0000', '#d4a373']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } }
      }
    });
  }

  function closeDistrictModal() {
    const modal = document.getElementById('districtModal');
    if (modal) modal.style.display = 'none';
  }

  // -------------------------------------------------------------
  // SECTION 13: QUICK FACTS & CHARTS GRID
  // -------------------------------------------------------------
  async function loadQuickFactsAndCharts() {
    try {
      const [statsResp, distResp, genderResp, largestResp, postalResp] = await Promise.all([
        safeFetch('/api/voters/statistics').then(r => r ? r.json() : null),
        safeFetch('/api/voters/districts').then(r => r ? r.json() : null),
        safeFetch('/api/voters/gender').then(r => r ? r.json() : null),
        safeFetch('/api/voters/largest-electorates?limit=10').then(r => r ? r.json() : null),
        safeFetch('/api/voters/postal').then(r => r ? r.json() : null)
      ]);

      if (statsResp) renderQuickFactsGrid(statsResp);
      if (distResp) renderChartDistrictTurnout(distResp);
      if (genderResp) renderChartGenderDistribution(genderResp);
      if (largestResp) renderChartTopElectorates(largestResp);
      if (postalResp && postalResp.top_districts) renderChartPostalVotes(postalResp.top_districts);
    } catch (e) {
      console.error("Failed to load quick facts & charts:", e);
    }
  }

  function renderQuickFactsGrid(s) {
    const container = document.getElementById('quickFactsGrid');
    if (!container || !s) return;

    const facts = [
      { label: "Largest Electorate", val: `${s.largest_electorate.constituency} (${fmt(s.largest_electorate.value)})`, dist: s.largest_electorate.district },
      { label: "Smallest Electorate", val: `${s.smallest_electorate.constituency} (${fmt(s.smallest_electorate.value)})`, dist: s.smallest_electorate.district },
      { label: "Highest Turnout", val: `${s.highest_turnout.constituency} (${fmtPct(s.highest_turnout.value)})`, dist: s.highest_turnout.district },
      { label: "Lowest Turnout", val: `${s.lowest_turnout.constituency} (${fmtPct(s.lowest_turnout.value)})`, dist: s.lowest_turnout.district },
      { label: "Highest Female %", val: `${s.highest_female_pct.constituency} (${fmtPct(s.highest_female_pct.value)})`, dist: s.highest_female_pct.district },
      { label: "Highest Male %", val: `${s.highest_male_pct.constituency} (${fmtPct(s.highest_male_pct.value)})`, dist: s.highest_male_pct.district },
      { label: "Highest TG Count", val: `${s.highest_third_gender.constituency} (${fmt(s.highest_third_gender.value)})`, dist: s.highest_third_gender.district },
      { label: "Most Postal Votes", val: `${s.most_postal_votes.constituency} (${fmt(s.most_postal_votes.value)})`, dist: s.most_postal_votes.district }
    ];

    let html = '';
    facts.forEach(f => {
      html += `
        <div class="quick-fact-card">
          <div class="quick-fact-label">${f.label}</div>
          <div class="quick-fact-val">${f.val}</div>
          <div class="quick-fact-sub">District: ${f.dist}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderChartDistrictTurnout(districts) {
    const ctx = document.getElementById('chartDistrictTurnout');
    if (!ctx || typeof Chart === 'undefined' || !districts) return;
    if (chartInstances['distTurnout']) chartInstances['distTurnout'].destroy();

    const labels = districts.map(d => d.district);
    const turnouts = districts.map(d => d.turnout_pct);

    chartInstances['distTurnout'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Turnout %',
          data: turnouts,
          backgroundColor: '#1f4e78'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 60, max: 100 },
          x: { ticks: { font: { size: 8 } } }
        }
      }
    });
  }

  function renderChartGenderDistribution(gender) {
    const ctx = document.getElementById('chartGenderDistribution');
    if (!ctx || typeof Chart === 'undefined' || !gender) return;
    if (chartInstances['genderDist']) chartInstances['genderDist'].destroy();

    chartInstances['genderDist'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Female Electors', 'Male Electors', 'Third Gender'],
        datasets: [{
          data: [gender.female_electors, gender.male_electors, gender.third_gender_electors],
          backgroundColor: ['#8b0000', '#1f4e78', '#d4a373']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  function renderChartTopElectorates(largest) {
    const ctx = document.getElementById('chartTopElectorates');
    if (!ctx || typeof Chart === 'undefined' || !largest) return;
    if (chartInstances['topElectorates']) chartInstances['topElectorates'].destroy();

    const labels = largest.map(d => d.constituency);
    const data = largest.map(d => d.registered_electors);

    chartInstances['topElectorates'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Registered Electors',
          data: data,
          backgroundColor: '#2d5a27'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  function renderChartPostalVotes(topPostal) {
    const ctx = document.getElementById('chartPostalVotes');
    if (!ctx || typeof Chart === 'undefined' || !topPostal) return;
    if (chartInstances['postalVotes']) chartInstances['postalVotes'].destroy();

    const labels = topPostal.map(d => d.district);
    const data = topPostal.map(d => d.postal_votes);

    chartInstances['postalVotes'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Postal Ballots Polled',
          data: data,
          backgroundColor: '#d4a373'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  // Auto-init on script load or DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init: init,
    filterDistrictLedger: filterDistrictLedger,
    sortDistrictLedger: sortDistrictLedger,
    changePage: changePage,
    exportDistrictLedgerCSV: exportDistrictLedgerCSV,
    exportDistrictLedgerExcel: exportDistrictLedgerExcel,
    handleSearchExplorer: handleSearchExplorer,
    openDistrictModal: openDistrictModal,
    closeDistrictModal: closeDistrictModal
  };
})();

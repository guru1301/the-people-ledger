/* =============================================================
   statistics.js — Statistics Page (Pure Visual Analytics Hub)
   18 Interactive Chart.js Charts & Executive Summary Dashboard
   ============================================================= */

const statisticsModule = (function() {
  let chartInstances = {};

  // Safe DOM element text setter
  function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = (val !== undefined && val !== null) ? val : '--';
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

  // Destroy previous chart instance cleanly before re-creating
  function createOrUpdateChart(canvasId, type, data, options) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return;

    if (chartInstances[canvasId]) {
      chartInstances[canvasId].destroy();
    }

    chartInstances[canvasId] = new Chart(ctx, {
      type: type,
      data: data,
      options: Object.assign({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: { family: "'Courier Prime', monospace", size: 10 }
            }
          }
        }
      }, options || {})
    });
  }

  // Render Table Body helper
  function renderTableBody(targetId, list, rowHtmlFn) {
    const tbody = document.getElementById(targetId);
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; font-style:italic">No records available.</td></tr>`;
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
    console.log("Initializing Statistics Visual Analytics Hub...");
    loadExecutiveSummary();
    loadChartsData();
  }

  // -------------------------------------------------------------
  // ELECTION AT A GLANCE EXECUTIVE SUMMARY
  // -------------------------------------------------------------
  async function loadExecutiveSummary() {
    try {
      const resp = await safeFetch('/api/statistics/summary');
      if (!resp) return;
      const d = await resp.json();

      setTxt('stat-glance-seats', d.total_seats || 234);
      setTxt('stat-glance-winner', d.winning_party || 'TVK');
      setTxt('stat-glance-majority', d.government_majority || '108 Seats');
      setTxt('stat-glance-electors', d.registered_electors || '57.41M');
      setTxt('stat-glance-voted', d.votes_cast || '49.39M');
      setTxt('stat-glance-turnout', d.turnout_pct || '86.03%');
      setTxt('stat-glance-women', d.women_mlas || 23);
      setTxt('stat-glance-youngest', d.youngest_mla || '28 Years');
      setTxt('stat-glance-oldest', d.oldest_mla || '83 Years');
      setTxt('stat-glance-avg-margin', d.average_margin || '16,784');
      setTxt('stat-glance-closest', d.closest_victory || '1 Vote');
      setTxt('stat-glance-landslide', d.largest_victory || '98,110');
      setTxt('stat-glance-nota', d.nota_votes || '199,801');
      setTxt('stat-glance-parties', d.parties_won || 12);
      setTxt('stat-glance-districts', d.districts || 38);
    } catch (e) {
      console.error("Failed to load executive summary:", e);
    }
  }

  // -------------------------------------------------------------
  // 18 VISUAL ANALYTICS CHARTS & RANKINGS
  // -------------------------------------------------------------
  async function loadChartsData() {
    try {
      const resp = await safeFetch('/api/statistics/charts');
      if (!resp) return;
      const c = await resp.json();

      // Chart 1: Party Seat Share (Donut)
      if (c.chart1_seat_share) {
        createOrUpdateChart('chart1SeatShare', 'doughnut', {
          labels: c.chart1_seat_share.labels,
          datasets: [{
            data: c.chart1_seat_share.data,
            backgroundColor: c.chart1_seat_share.colors
          }]
        }, {
          plugins: { legend: { position: 'right' } }
        });
      }

      // Chart 2: Vote Share vs Seat Share (Grouped Bar)
      if (c.chart2_fptp) {
        createOrUpdateChart('chart2FPTP', 'bar', {
          labels: c.chart2_fptp.labels,
          datasets: [
            { label: 'Vote Share %', data: c.chart2_fptp.vote_share, backgroundColor: '#1f4e78' },
            { label: 'Seat Share %', data: c.chart2_fptp.seat_share, backgroundColor: '#8b0000' }
          ]
        }, {
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 3: Winning Margin Distribution (Histogram)
      if (c.chart3_margins) {
        createOrUpdateChart('chart3Margins', 'bar', {
          labels: c.chart3_margins.labels,
          datasets: [{
            label: 'Constituencies Count',
            data: c.chart3_margins.counts,
            backgroundColor: '#d4a72c',
            borderColor: '#111111',
            borderWidth: 1
          }]
        }, {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 4: Turnout Distribution Spectrum (Histogram)
      if (c.chart4_turnout) {
        createOrUpdateChart('chart4Turnout', 'bar', {
          labels: c.chart4_turnout.labels,
          datasets: [{
            label: 'Constituencies Count',
            data: c.chart4_turnout.counts,
            backgroundColor: '#8b0000',
            borderColor: '#111111',
            borderWidth: 1
          }]
        }, {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 5: Party Performance by District (Stacked Bar)
      if (c.chart5_district) {
        createOrUpdateChart('chart5District', 'bar', {
          labels: c.chart5_district.districts,
          datasets: [
            { label: 'TVK Seats', data: c.chart5_district.tvk, backgroundColor: '#d4a72c' },
            { label: 'DMK Seats', data: c.chart5_district.dmk, backgroundColor: '#c0001a' },
            { label: 'AIADMK Seats', data: c.chart5_district.aiadmk, backgroundColor: '#277239' }
          ]
        }, {
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
        });
      }

      // Chart 6: Women Representation (Donut)
      if (c.chart6_women) {
        createOrUpdateChart('chart6Women', 'doughnut', {
          labels: c.chart6_women.labels,
          datasets: [{
            data: c.chart6_women.data,
            backgroundColor: c.chart6_women.colors
          }]
        }, {
          plugins: { legend: { position: 'bottom' } }
        });
      }

      // Chart 7: Age Distribution (Histogram)
      if (c.chart7_age) {
        createOrUpdateChart('chart7Age', 'bar', {
          labels: c.chart7_age.labels,
          datasets: [{
            label: 'Elected MLAs Count',
            data: c.chart7_age.counts,
            backgroundColor: '#1f4e78'
          }]
        }, {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 8: Educational Qualification (Bar)
      if (c.chart8_education) {
        createOrUpdateChart('chart8Education', 'bar', {
          labels: c.chart8_education.labels,
          datasets: [{
            label: 'MLAs Qualification',
            data: c.chart8_education.counts,
            backgroundColor: '#277239'
          }]
        }, {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 9: Criminal Cases Breakdown (Doughnut)
      if (c.chart9_criminal) {
        createOrUpdateChart('chart9Criminal', 'doughnut', {
          labels: c.chart9_criminal.labels,
          datasets: [{
            data: c.chart9_criminal.data,
            backgroundColor: c.chart9_criminal.colors
          }]
        }, {
          plugins: { legend: { position: 'bottom' } }
        });
      }

      // Chart 10: Declared Assets Distribution (Bar)
      if (c.chart10_assets) {
        createOrUpdateChart('chart10Assets', 'bar', {
          labels: c.chart10_assets.labels,
          datasets: [{
            label: 'Candidates / MLAs Count',
            data: c.chart10_assets.counts,
            backgroundColor: '#d4a373'
          }]
        }, {
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        });
      }

      // Chart 11: Seat Reservation Category (Pie)
      if (c.chart11_reservation) {
        createOrUpdateChart('chart11Reservation', 'pie', {
          labels: c.chart11_reservation.labels,
          datasets: [{
            data: c.chart11_reservation.data,
            backgroundColor: c.chart11_reservation.colors
          }]
        }, {
          plugins: { legend: { position: 'bottom' } }
        });
      }

      // Chart 12: Party-wise Winners Tally (Horizontal Bar)
      if (c.chart12_winners_tally) {
        const labels = c.chart12_winners_tally.map(item => item.party);
        const seats = c.chart12_winners_tally.map(item => item.seats);

        createOrUpdateChart('chart12Winners', 'bar', {
          labels: labels,
          datasets: [{
            label: 'Total Seats Won',
            data: seats,
            backgroundColor: '#d4a72c'
          }]
        }, {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } }
        });
      }

      // Chart 13: Top 10 Closest Victories (Ranking Table)
      if (c.chart13_closest) {
        renderTableBody('tableClosestBody', c.chart13_closest, item => `
          <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
          <td class="strong" style="color:var(--ink-red)">${item.winner}</td>
          <td class="text-right font-mono strong" style="color:var(--ink-green)">${item.margin} Vote${item.margin > 1 ? 's' : ''}</td>
          <td class="font-mono">${item.runner_up}</td>
        `);
      }

      // Chart 14: Top 10 Largest Landslides (Ranking Table)
      if (c.chart14_landslides) {
        renderTableBody('tableLandslidesBody', c.chart14_landslides, item => `
          <td class="strong">${item.constituency} (AC ${item.ac_no})</td>
          <td class="strong" style="color:var(--ink-red)">${item.winner}</td>
          <td class="text-right font-mono strong">${item.margin.toLocaleString()}</td>
          <td class="font-mono">${item.runner_up}</td>
        `);
      }

      // Chart 15: NOTA Ranking Table
      if (c.chart15_nota) {
        renderTableBody('tableNOTABody', c.chart15_nota, item => `
          <td class="font-mono text-center">${item.rank}</td>
          <td class="strong">${item.constituency}</td>
          <td class="text-right font-mono strong">${item.nota_votes.toLocaleString()}</td>
          <td class="text-right font-mono">${item.nota_pct}%</td>
        `);
      }

      // Chart 16: Incumbent Performance (Doughnut)
      if (c.chart16_incumbent) {
        createOrUpdateChart('chart16Incumbent', 'doughnut', {
          labels: c.chart16_incumbent.labels,
          datasets: [{
            data: c.chart16_incumbent.data,
            backgroundColor: c.chart16_incumbent.colors
          }]
        }, {
          plugins: { legend: { position: 'bottom' } }
        });
      }

      // Chart 17: First-Time Winners vs Experienced (Pie)
      if (c.chart17_firsttime) {
        createOrUpdateChart('chart17Firsttime', 'pie', {
          labels: c.chart17_firsttime.labels,
          datasets: [{
            data: c.chart17_firsttime.data,
            backgroundColor: c.chart17_firsttime.colors
          }]
        }, {
          plugins: { legend: { position: 'bottom' } }
        });
      }

      // Chart 18: Candidate Gender Breakdown by Major Party (Grouped Stacked Bar)
      if (c.chart18_gender_party) {
        createOrUpdateChart('chart18GenderParty', 'bar', {
          labels: c.chart18_gender_party.parties,
          datasets: [
            { label: 'Female Candidates', data: c.chart18_gender_party.female, backgroundColor: '#8b0000' },
            { label: 'Male Candidates', data: c.chart18_gender_party.male, backgroundColor: '#1f4e78' }
          ]
        }, {
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
        });
      }

    } catch (e) {
      console.error("Failed to load charts data:", e);
    }
  }

  // Auto-init on script load or DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init: init
  };
})();

/* =============================================================
   statistics.js — Chart.js histogram and reserved-seat bar chart
   ============================================================= */

let marginHistogramChart      = null;
let marginReservedChartInstance = null;

function renderCharts(lang) {
  const chartFont = { family: "'Playfair Display', Georgia, serif", size: 11 };

  const labelMargin   = lang === 'en' ? 'Constituencies Count'  : 'தொகுதிகளின் எண்ணிக்கை';
  const labelReserved = lang === 'en' ? 'Avg Vote Margin'       : 'சராசரி வாக்கு வித்தியாசம்';

  const labelsHistogram = lang === 'en'
    ? ['<2k', '2k-5k', '5k-10k', '10k-20k', '20k-50k', '50k+']
    : ['<2ஆயிரம்', '2ஆ-5ஆ', '5ஆ-10ஆ', '10ஆ-20ஆ', '20ஆ-50ஆ', '50ஆயிரம்+'];

  const labelsReserved = lang === 'en'
    ? ['General (188)', 'SC Reserved (44)', 'ST Reserved (2)']
    : ['பொது (188)', 'எஸ்.சி தனித்தொகுதி (44)', 'எஸ்.டி தனித்தொகுதி (2)'];

  document.getElementById('chart-va-title').textContent = lang === 'en'
    ? "Figure V-A: Frequency Distribution of Winning Margins"
    : "படம் V-A: வெற்றி வாக்கு வித்தியாசம் குறித்த அதிர்வெண் பரவல்";

  document.getElementById('chart-vb-title').textContent = lang === 'en'
    ? "Figure V-B: Average Margin by Reservation (SC/ST)"
    : "படம் V-B: தனித்தொகுதிகளின் சராசரி வாக்கு வித்தியாசம்";

  if (marginHistogramChart)       marginHistogramChart.destroy();
  if (marginReservedChartInstance) marginReservedChartInstance.destroy();

  const histCtx = document.getElementById('marginHistogram').getContext('2d');
  marginHistogramChart = new Chart(histCtx, {
    type: 'bar',
    data: {
      labels: labelsHistogram,
      datasets: [{ label: labelMargin, data: [27, 34, 43, 67, 48, 15], backgroundColor: 'rgba(30, 26, 21, 0.85)', borderColor: 'var(--ink-charcoal)', borderWidth: 1 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: chartFont, color: 'var(--ink-charcoal)' } },
        y: { grid: { borderDash: [2, 4], color: 'var(--paper-bg-darker)' }, ticks: { font: chartFont, color: 'var(--ink-charcoal)' } }
      }
    }
  });

  const resCtx = document.getElementById('marginReservedChart').getContext('2d');
  marginReservedChartInstance = new Chart(resCtx, {
    type: 'bar',
    data: {
      labels: labelsReserved,
      datasets: [{ label: labelReserved, data: [17544, 14192, 2422], backgroundColor: ['rgba(128,29,29,0.85)', 'rgba(30,26,21,0.85)', 'rgba(30,26,21,0.5)'], borderColor: 'var(--ink-charcoal)', borderWidth: 1 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: chartFont, color: 'var(--ink-charcoal)' } },
        y: { grid: { borderDash: [2, 4], color: 'var(--paper-bg-darker)' }, ticks: { font: chartFont, color: 'var(--ink-charcoal)' } }
      }
    }
  });
}

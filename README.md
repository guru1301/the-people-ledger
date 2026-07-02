# 🗞️ The People's Ledger
### Tamil Nadu 2026 Assembly Election — Analytics Dashboard

> *"Who really won Tamil Nadu — and what does the data actually say?"*

**Status:** 🔄 In Progress — Analysis & data pipeline complete | Frontend & backend in active development

---

## 📌 Project Overview

A full-stack data analytics project built around the **Tamil Nadu 2026 Legislative Assembly Election** — 234 constituencies, 4,000+ candidates, real ECI data.

The goal is not a horse-race political dashboard. It's a **societal story told through data** — voter behaviour, geographic patterns, and the mathematics of how seats are won and lost — presented as an old-newspaper themed interactive dashboard.

Built as a portfolio project targeting **Analytics Engineer** roles.

---

## 🔍 Key Findings (verified, independently re-checked)

### 1. Women Voted More Than Men — In 70% of Seats
Across 234 constituencies, women voted at a higher rate than men in **165 seats (~70%)**, with a statewide average gap of **+2.33 percentage points**. The gap is strongest in Ramanathapuram, Sivaganga, and the Cauvery Delta — and disappears near Chennai and the western textile belt.

### 2. TVK Won the Most Seats — But Not the Most Votes *(strongest finding)*
Statewide, DMK (24.19%) + AIADMK (21.21%) together received **45.40%** of all votes — more than TVK's 34.92%. Yet TVK won **107 of 234 seats**, the largest single-party bloc. In **45 of those 107 wins (42%)**, the combined DMK+AIADMK vote actually exceeded TVK's share in that constituency. TVK won because the opposition split — not because it was the most popular party seat-by-seat.

> *Example: Gummidipoondi (AC 1) — TVK 40.56% vs DMK 26.88% + AIADMK 28.55% = 55.42% combined.*

### 3. The Closest Race Was Decided by Postal Votes
Tamil Nadu's closest race — **Tiruppattur, won by just 30 votes** — would have flipped without postal votes. On EVM votes alone, the runner-up led by 788 votes. Postal votes changed the outcome in exactly one seat in the entire state.

### 4. Margin Distribution Across All 234 Seats
| Margin Range | Seats |
|---|---|
| Under 2,000 votes | 27 |
| 2,000 – 5,000 | 34 |
| 5,000 – 10,000 | 43 |
| 10,000 – 20,000 | 67 |
| 20,000 – 50,000 | 48 |
| Over 50,000 | 15 |

Biggest landslide: **Edappadi — 98,110 votes** (independently verified against press reports).

### 5. NOTA Hotspots
Statewide NOTA average: **0.41%**. Highest: Udhagamandalam (1.04%), Bhavanisagar (0.85%), Thalli (0.76%).

### 6. Reserved Seats Were More Competitive
Average winning margin — SC seats: **14,192 votes** vs General seats: **17,544 votes**. TVK's win rate was slightly higher in SC-reserved seats (52.3%) than General seats (44.1%).

---

## 🗂️ Data Sources (all real, official ECI data)

| File | Description |
|---|---|
| `eci_results_tamilnadu_2026.csv` | Full candidate-level results, 234 constituencies |
| `candidates_list_2026.csv` | Candidate metadata — party, alliance, reserved category |
| `2021_election_results.xlsx` | 2021 results for swing/flip analysis |
| `voters.xlsx` | 2026 electoral roll — electors by gender per constituency |
| `2026_voters_voted.xlsx` | 2026 turnout — votes cast by gender, NOTA, postal |
| `cabinet_2026.csv` | Council of Ministers — CM, portfolios, constituencies |
| `assembly_officials_2026.csv` | Speaker, LOP, Deputy Speaker, other officials |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Database | Snowflake (star schema) |
| Backend | FastAPI (Python) |
| Frontend | HTML / CSS / JavaScript (old-newspaper theme) |
| Analysis | Python (Pandas) — Google Colab |
| Second Dashboard | Power BI |
| Report | Written analysis + PDF |

---

## 🏗️ Architecture

```
Raw CSVs / XLSX
      ↓
Python ETL (Pandas) — cleaning, joins, derived metrics
      ↓
Snowflake (Star Schema)
      ↓
FastAPI Backend (REST endpoints)
      ↓
HTML/CSS/JS Frontend ←→ Power BI Dashboard
```

**Star Schema:**
- `dim_constituency` — AC_No, AC_Name, District, Region, Reserved category
- `dim_party` — Party full name, short code, Alliance
- `dim_government` — Cabinet + assembly officials combined
- `fact_results_2026` — Candidate-level results, vote share, winner flag
- `fact_results_2021` — 2021 results (normalized party codes for comparison)
- `fact_turnout_2026` — Gender turnout, NOTA %, postal votes per seat
- `fact_swing` — 2021 vs 2026 winner comparison, seat-flip flag

---

## 📰 Dashboard Pages (in development)

| Page | Description |
|---|---|
| **Home** | Newspaper front page — vote-split as lead story, gender gap and NOTA as side columns, margins as stat strip |
| **Results** | Search/filter any of 234 constituencies — all candidates, votes, winner, margin |
| **Voters & Turnout** | Per-constituency electors, gender split, turnout %, NOTA, postal |
| **Government** | Full cabinet with portfolios, Speaker, Leader of Opposition |
| **Statistics** | Margin histogram, reserved-seat analysis, postal-vote callout, regression/clustering (one model, TBD) |

---

## 📁 Repository Structure

```
the-peoples-ledger/
├── election/
│   ├── raw_data/          # Original ECI files (unmodified)
│   ├── cleaned_data/      # Processed CSVs ready for Snowflake load
│   └── analysis.ipynb     # Google Colab notebook — cleaning + findings
├── dashboard/
│   ├── *.html             # Frontend pages
│   └── *.js               # JavaScript logic
└── README.md
```

---

## ⚠️ Data Integrity Notes

- All 6 findings independently re-verified 2–4 times each before publication
- Known data quality issues documented and fixed (constituency name mismatches, header row offsets, party code normalization across years)
- The vote-split finding (Finding 2) and Edappadi margin (Finding 4) were cross-validated against independent press reports
- The Tiruppattur postal-vote finding (Finding 6) is precise and reproducible — replicable directly from the raw ECI files
- Region classification in `dim_constituency` is self-built from general TN geography, not from an official source — flagged transparently

---

## 🚧 Roadmap

- [x] Load and clean all 7 source files
- [x] Identify and fix all data quality issues
- [x] Compute and verify all 6 findings
- [x] Design star schema
- [ ] Load tables into Snowflake
- [ ] Build FastAPI backend
- [ ] Complete frontend (newspaper theme)
- [ ] Build Power BI dashboard
- [ ] 2021 vs 2026 swing/seat-flip table
- [ ] One statistical/ML model (regression or clustering — TBD)
- [ ] Written analysis report + PDF

---

*Data source: Election Commission of India (ECI) official results, Tamil Nadu 2026 Legislative Assembly Election.*

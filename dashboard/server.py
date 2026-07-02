import os
import sys
import logging
from flask import Flask, jsonify, send_from_directory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.', static_url_path='')

# Initialize BigQuery Client
bq_client = None
try:
    from google.cloud import bigquery
    if os.path.exists('gcp-key.json'):
        bq_client = bigquery.Client.from_service_account_json('gcp-key.json')
        logger.info("Successfully initialized BigQuery client using gcp-key.json.")
    else:
        bq_client = bigquery.Client()
        logger.info("Successfully initialized BigQuery client using default credentials.")
except Exception as e:
    logger.warning(f"Could not initialize BigQuery client: {e}. Running in local fallback mode.")

# Import pandas for excel reading fallback
try:
    import pandas as pd
except ImportError:
    pd = None
    logger.warning("pandas is not installed. Excel fallback might fail.")

# Fallback datasets (findings)
FINDINGS_FALLBACK = [
  {
    "id": "01",
    "categoryEn": "Electoral Margin",
    "categoryTa": "வாக்குப்பதிவு விளிம்பு",
    "keyNumber": "30 Votes",
    "keyNumberTa": "30 வாக்குகள்",
    "titleEn": "Tiruppattur's Razor-Thin Margin",
    "titleTa": "திருப்பத்தூரின் மிகக் குறைந்த வாக்கு வித்தியாசம்",
    "summaryEn": "The closest contest in the state was decided by a mere 30 votes, with postal ballots proving to be the ultimate decider.",
    "summaryTa": "மாநிலத்தின் மிக நெருக்கமான போட்டி வெறும் 30 வாக்குகள் வித்தியாசத்தில் முடிவடைந்தது, இதில் தபால் வாக்குகளே வெற்றியைத் தீர்மானித்தன."
  },
  {
    "id": "02",
    "categoryEn": "Electoral Pulse",
    "categoryTa": "தேர்தல் வேகம்",
    "keyNumber": "74.00%",
    "keyNumberTa": "74.00%",
    "titleEn": "Statewide Average Turnout",
    "titleTa": "மாநில சராசரி வாக்குப்பதிவு",
    "summaryEn": "Voter turnout across Tamil Nadu's 234 assembly divisions maintained a high average of 74.00%, proving robust democratic participation.",
    "summaryTa": "தமிழகத்தின் 234 சட்டமன்றத் தொகுதிகளிலும் சராசரியாக 74.00% வாக்குப்பதிவு பதிவாகியுள்ளது, இது மக்களின் பலமான ஈடுபாட்டைக் காட்டுகிறது."
  },
  {
    "id": "03",
    "categoryEn": "Demography Analysis",
    "categoryTa": "மக்கள் தொகை பகுப்பாய்வு",
    "keyNumber": "165 Seats",
    "keyNumberTa": "165 தொகுதிகள்",
    "titleEn": "Female Turnout Advantage",
    "titleTa": "பெண்களின் கூடுதல் வாக்குப்பதிவு",
    "summaryEn": "In 165 out of 234 constituencies, the percentage of female voters who turned out exceeded the male turnout percentage.",
    "summaryTa": "தமிழகத்தின் 234 தொகுதிகளில் 165 தொகுதிகளில் பெண் வாக்காளர்கள் ஆண்களை விட அதிக வாக்குப்பதிவு சதவீதத்தைப் பதிவு செய்துள்ளனர்."
  },
  {
    "id": "04",
    "categoryEn": "ECI Dissatisfaction",
    "categoryTa": "தேர்தல் ஆணைய அதிருப்தி",
    "keyNumber": "52 Seats",
    "keyNumberTa": "52 தொகுதிகள்",
    "titleEn": "NOTA Margin Outpolls",
    "titleTa": "வெற்றி வித்தியாசத்தை முறியடித்த நோட்டா",
    "summaryEn": "In 52 seats, the number of NOTA (None of the Above) votes was larger than the final winning margin, serving as a decisive factor.",
    "summaryTa": "மாநிலத்தில் 52 தொகுதிகளில் நோட்டா வாக்குகள் வெற்றி வித்தியாசத்தை விட அதிகமாகப் பதிவாகி முடிவுகளைத் தீர்மானிப்பதில் பங்கு வகித்துள்ளன."
  },
  {
    "id": "05",
    "categoryEn": "Peak Turnout",
    "categoryTa": "அதிகபட்ச வாக்குப்பதிவு",
    "keyNumber": "88.08%",
    "keyNumberTa": "88.08%",
    "titleEn": "Peak Electorate Participation",
    "titleTa": "அதிகபட்ச வாக்குப்பதிவு",
    "summaryEn": "Palacode constituency registered the highest overall turnout in the state, showcasing exceptional electoral mobilization.",
    "summaryTa": "மாநிலத்திலேயே அதிகபட்ச வாக்குப்பதிவாக பாலக்கோடு தொகுதியில் 88.08% வாக்குகள் பதிவாகி புதிய சாதனை படைக்கப்பட்டுள்ளது."
  },
  {
    "id": "06",
    "categoryEn": "Urban Participation",
    "categoryTa": "நகர்ப்புறப் பங்களிப்பு",
    "keyNumber": "51.52%",
    "keyNumberTa": "51.52%",
    "titleEn": "Lowest Voter Participation",
    "titleTa": "குறைந்தபட்ச வாக்குப்பதிவு",
    "summaryEn": "Harbour constituency in Chennai recorded the lowest turnout in the state, indicating urban voter apathy in metropolitan areas.",
    "summaryTa": "சென்னையின் துறைமுகம் தொகுதி 51.52% வாக்குப்பதிவுடன் மாநிலத்திலேயே மிகக் குறைந்த சதவீதத்தைப் பதிவு செய்துள்ளது."
  },
  {
    "id": "07",
    "categoryEn": "Assembly Seats",
    "categoryTa": "சட்டமன்ற இடங்கள்",
    "keyNumber": "107 Seats",
    "keyNumberTa": "107 இடங்கள்",
    "titleEn": "TVK Coalition Majority",
    "titleTa": "தவெக கூட்டணியின் இடங்கள்",
    "summaryEn": "The newly formed TVK coalition captured 107 seats, making it the single largest legislative block in the 234-seat assembly.",
    "summaryTa": "234 தொகுதிகள் கொண்ட தமிழக சட்டப்பேரவையில் புதிய தவெக கூட்டணி 107 இடங்களைக் கைப்பற்றி தனிப்பெரும் கூட்டணியாக உருவெடுத்துள்ளது."
  },
  {
    "id": "08",
    "categoryEn": "Opposition Coalition",
    "categoryTa": "எதிர்க்கட்சி கூட்டணி",
    "keyNumber": "68 Seats",
    "keyNumberTa": "68 இடங்கள்",
    "titleEn": "DMK Alliance Opposition Bloc",
    "titleTa": "திமுக கூட்டணியின் செயல்பாடு",
    "summaryEn": "The DMK-led alliance secured 68 seats statewide, maintaining a strong opposition bloc with significant vote shares.",
    "summaryTa": "திமுக தலைமையிலான கூட்டணி மாநிலம் தழுவி 68 இடங்களை வென்று, சட்டமன்றத்தில் ஒரு பலமான எதிர்க்கட்சியாக அமைகிறது."
  },
  {
    "id": "09",
    "categoryEn": "Regional Strengths",
    "categoryTa": "பிராந்திய பலம்",
    "keyNumber": "59 Seats",
    "keyNumberTa": "59 இடங்கள்",
    "titleEn": "AIADMK Alliance Western Share",
    "titleTa": "அதிமுக கூட்டணியின் இடங்கள்",
    "summaryEn": "The AIADMK-led front secured 59 seats, capturing critical constituencies across the western belt of the state.",
    "summaryTa": "அதிமுக தலைமையிலான கூட்டணி 59 இடங்களில் வெற்றி பெற்று, கொங்கு மண்டலத்தின் பல தொகுதிகளில் தனது ஆதிக்கத்தைத் தக்கவைத்துள்ளது."
  },
  {
    "id": "10",
    "categoryEn": "Reserved Constituencies",
    "categoryTa": "தனித்தொகுதிகள்",
    "keyNumber": "14,192 Votes",
    "keyNumberTa": "14,192 வாக்குகள்",
    "titleEn": "Reserved Seats Competitiveness",
    "titleTa": "தனித்தொகுதிகளின் போட்டித்தன்மை",
    "summaryEn": "Scheduled Castes (SC) reserved seats proved significantly more competitive, returning a tighter average winning margin of 14,192 votes.",
    "summaryTa": "பொது தொகுதிகளை விட SC தனித்தொகுதிகள் 14,192 வாக்குகள் என்ற மிகக் குறைந்த சராசரி வித்தியாசத்துடன் அதிக போட்டித்தன்மையைக் காட்டின."
  },
  {
    "id": "11",
    "categoryEn": "Gender Voting Gap",
    "categoryTa": "பாலின வாக்குப்பதிவு இடைவெளி",
    "keyNumber": "+11.40%",
    "keyNumberTa": "+11.40%",
    "titleEn": "Highest Female Turnout Gap",
    "titleTa": "அதிகபட்ச பெண்கள் வாக்குப்பதிவு இடைவெளி",
    "summaryEn": "Ramanathapuram documented a record female turnout gap, with women outvoting men by a margin of 11.40 percentage points.",
    "summaryTa": "ராமநாதபுரம் தொகுதியில் பெண் வாக்காளர்கள் ஆண்களை விட 11.40% அதிகமாக வாக்கு செலுத்தி புதிய சாதனை படைத்துள்ளனர்."
  },
  {
    "id": "12",
    "categoryEn": "Voter Discontent",
    "categoryTa": "வாக்காளர் அதிருப்தி",
    "keyNumber": "1.04%",
    "keyNumberTa": "1.04%",
    "titleEn": "Highest NOTA Share",
    "titleTa": "அதிகபட்ச நோட்டா வாக்குகள்",
    "summaryEn": "Udhagamandalam constituency recorded the highest NOTA share in the state, with 1.04% of voters rejecting all candidates.",
    "summaryTa": "உதகமண்டலம் தொகுதியில் மாநிலத்திலேயே அதிகபட்சமாக 1.04% வாக்காளர்கள் நோட்டாவிற்கு வாக்களித்து தங்கள் அதிருப்தியைப் பதிவு செய்துள்ளனர்."
  },
  {
    "id": "13",
    "categoryEn": "Metropolitan Laggard",
    "categoryTa": "மாநகர சுணக்கம்",
    "keyNumber": "58.12%",
    "keyNumberTa": "58.12%",
    "titleEn": "Metropolitan Turnout Lag",
    "titleTa": "சென்னை மாநகர வாக்குப்பதிவு சுணக்கம்",
    "summaryEn": "Chennai district logged the lowest average turnout among all districts, showing a significant metropolitan voter lag.",
    "summaryTa": "தமிழகத்தின் அனைத்து மாவட்டங்களையும் ஒப்பிடுகையில், சென்னை மாவட்டம் 58.12% என்ற மிகக் குறைந்த சராசரி வாக்குப்பதிவைச் சந்தித்தது."
  },
  {
    "id": "14",
    "categoryEn": "Electoral Demographics",
    "categoryTa": "தேர்தல் புள்ளிவிவரம்",
    "keyNumber": "6.2 Crore",
    "keyNumberTa": "6.2 கோடி",
    "titleEn": "Total Electorate Size",
    "titleTa": "மொத்த வாக்காளர்களின் எண்ணிக்கை",
    "summaryEn": "Tamil Nadu's registered voter base reached a monumental size of over 6.2 crore electors in the 2026 assembly elections.",
    "summaryTa": "தமிழகத்தின் மொத்த பதிவுசெய்யப்பட்ட வாக்காளர்களின் எண்ணிக்கை 2026-ல் 6.2 கோடி என்ற இமாலய எல்லையைத் தாண்டியுள்ளது."
  },
  {
    "id": "15",
    "categoryEn": "Postal Ballot Decider",
    "categoryTa": "தபால் வாக்குத் தீர்ப்பு",
    "keyNumber": "1 Seat",
    "keyNumberTa": "1 தொகுதி",
    "titleEn": "Postal Ballot Decisive Outcome",
    "titleTa": "தபால் வாக்குகளால் மாறிய தொகுதி",
    "summaryEn": "Excluding postal ballots would have changed the winning party in only one constituency across the entire state: Tiruppattur.",
    "summaryTa": "தபால் வாக்குகளைத் தவிர்த்திருந்தால், மாநிலத்தின் திருப்பத்தூர் தொகுதியில் மட்டும் வெற்றி பெற்ற கட்சி மாறியிருக்கும்."
  },
  {
    "id": "16",
    "categoryEn": "Youth Leadership",
    "categoryTa": "இளைய சட்டமன்ற உறுப்பினர்",
    "keyNumber": "28 Years",
    "keyNumberTa": "28 வயது",
    "titleEn": "Youngest Winning Legislator",
    "titleTa": "இளைய சட்டமன்ற உறுப்பினர்",
    "summaryEn": "The youngest elected candidate to join the assembly in 2026 is 28 years old, representing youth representation in governance.",
    "summaryTa": "2026 சட்டமன்றத்தில் நுழையும் மிக இளம் வயது சட்டமன்ற உறுப்பினர் 28 வயது நிரம்பியவர் ஆவார்."
  },
  {
    "id": "17",
    "categoryEn": "Veteran Experience",
    "categoryTa": "முதுபெரும் அனுபவம்",
    "keyNumber": "84 Years",
    "keyNumberTa": "84 வயது",
    "titleEn": "Oldest Legislative Member",
    "titleTa": "முதுபெரும் சட்டமன்ற உறுப்பினர்",
    "summaryEn": "The assembly's oldest member is 84 years old, representing decades of political experience in state governance.",
    "summaryTa": "புதிய சட்டமன்றத்தின் மிக மூத்த உறுப்பினர் 84 வயது நிரம்பியவர் ஆவார், இவர் பல தசாப்த கால அரசியல் அனுபவம் கொண்டவர்."
  },
  {
    "id": "18",
    "categoryEn": "Independent Candidates",
    "categoryTa": "சுயேச்சைகளின் நிலை",
    "keyNumber": "0 Seats",
    "keyNumberTa": "0 இடங்கள்",
    "titleEn": "Independent Candidate Challenge",
    "titleTa": "சுயேச்சைகளின் செயல்பாடு",
    "summaryEn": "Despite hundreds of independent candidates contesting, zero independent candidates succeeded in winning a seat.",
    "summaryTa": "இந்தத் தேர்தலில் போட்டியிட்ட நூற்றுக்கணக்கான சுயேச்சை வேட்பாளர்களில் ஒருவரால் கூட எந்த ஒரு தொகுதியிலும் வெற்றி பெற இயலவில்லை."
  },
  {
    "id": "19",
    "categoryEn": "Victory Margins",
    "categoryTa": "வெற்றி வாக்குகள்",
    "keyNumber": "16,842 Votes",
    "keyNumberTa": "16,842 வாக்குகள்",
    "titleEn": "Average Winning Margin",
    "titleTa": "சராசரி வாக்கு வித்தியாசம்",
    "summaryEn": "The average winning margin across all 234 assembly seats was 16,842 votes, highlighting moderate electoral splits.",
    "summaryTa": "தமிழகத்தின் அனைத்து 234 தொகுதிகளின் சராசரி வெற்றி வாக்கு வித்தியாசம் 16,842 ஆகப் பதிவாகியுள்ளது."
  }
]

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response

# Static routes mapping
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# API Endpoints
@app.route('/api/ministers', methods=['GET'])
def get_ministers():
    # Read the local ministers Excel to get Tamil translations mapping
    local_ministers = {}
    try:
        if pd is not None and os.path.exists('ministers.xlsx'):
            df = pd.read_excel('ministers.xlsx')
            df = df.fillna('')
            for _, row in df.iterrows():
                local_ministers[row['Name_EN']] = {
                    'Name_TA': row.get('Name_TA', ''),
                    'Designation_TA': row.get('Designation_TA', ''),
                    'Portfolios_TA': row.get('Portfolios_TA', ''),
                    'Constituency_TA': row.get('Constituency_TA', '')
                }
    except Exception as ex:
        logger.warning(f"Could not load local ministers translations: {ex}")

    if bq_client:
        try:
            query = "SELECT * FROM `tn-election-2026-501004.tn_election_2026.dim_government` ORDER BY Rank_Order"
            query_job = bq_client.query(query)
            results = query_job.result()
            ministers = []
            for row in results:
                m = dict(row)
                name_en = m.get('Name', '')
                # Map columns to match frontend expectations
                m['Name_EN'] = name_en
                m['Designation_EN'] = m.get('Designation', '')
                m['Portfolios_EN'] = m.get('Portfolios', '')
                m['Constituency_EN'] = m.get('Constituency', '')
                m['Age'] = m.get('Age', 0)
                m['Party'] = m.get('Party', '')
                m['Rank_Order'] = m.get('Rank_Order', 99)
                m['AC_No'] = m.get('AC_No', 0)
                
                # Fetch Tamil translation from local spreadsheet mapping
                trans = local_ministers.get(name_en, {})
                m['Name_TA'] = trans.get('Name_TA', name_en)
                m['Designation_TA'] = trans.get('Designation_TA', m.get('Designation', ''))
                m['Portfolios_TA'] = trans.get('Portfolios_TA', m.get('Portfolios', ''))
                m['Constituency_TA'] = trans.get('Constituency_TA', m.get('Constituency', ''))
                
                ministers.append(m)
                
            logger.info(f"Fetched {len(ministers)} ministers from BigQuery (dim_government).")
            return jsonify(ministers)
        except Exception as e:
            logger.error(f"BigQuery ministers query failed: {e}. Falling back to local file.")
    
    # Local Excel Fallback
    try:
        if pd is not None:
            df = pd.read_excel('ministers.xlsx')
            df = df.fillna('')
            ministers = df.to_dict(orient='records')
            logger.info(f"Fetched {len(ministers)} ministers from local ministers.xlsx.")
            return jsonify(ministers)
    except Exception as ex:
        logger.error(f"Excel ministers fallback failed: {ex}")
    
    return jsonify([])

@app.route('/api/officials', methods=['GET'])
def get_officials():
    # Since there is no officials table in BigQuery, read directly from local sheet
    try:
        if pd is not None:
            df = pd.read_excel('officals.xlsx')
            df = df.fillna('')
            if 'took_office' in df.columns:
                df['took_office'] = df['took_office'].astype(str)
            officials = df.to_dict(orient='records')
            logger.info(f"Fetched {len(officials)} officials from local officals.xlsx.")
            return jsonify(officials)
    except Exception as ex:
        logger.error(f"Excel officials fallback failed: {ex}")
        
    return jsonify([])

@app.route('/api/findings', methods=['GET'])
def get_findings():
    if bq_client:
        try:
            query = "SELECT * FROM `election_dataset.findings` ORDER BY id"
            query_job = bq_client.query(query)
            results = query_job.result()
            findings = [dict(row) for row in results]
            logger.info(f"Fetched {len(findings)} findings from BigQuery.")
            return jsonify(findings)
        except Exception as e:
            logger.error(f"BigQuery findings query failed: {e}. Falling back to local list.")
            
    logger.info(f"Fetched {len(FINDINGS_FALLBACK)} findings from local fallback list.")
    return jsonify(FINDINGS_FALLBACK)

@app.route('/api/constituencies', methods=['GET'])
def get_constituencies():
    if bq_client:
        try:
            query = """
            WITH RankedCandidates AS (
              SELECT 
                AC_No,
                Candidate,
                Party,
                Total_Votes,
                ROW_NUMBER() OVER (PARTITION BY AC_No ORDER BY Total_Votes DESC) as rank
              FROM `tn-election-2026-501004.tn_election_2026.fact_results_2026`
            )
            SELECT 
              c.AC_No AS ac_no,
              c.AC_Name AS ac_name,
              c.District AS district,
              c.Reserved AS reserved,
              w.Candidate AS winner_name,
              COALESCE(pw.Party_Short, w.Party) AS winner_party,
              w.Total_Votes AS winner_votes,
              r.Candidate AS runner_up_name,
              COALESCE(pr.Party_Short, r.Party) AS runner_up_party,
              r.Total_Votes AS runner_up_votes,
              t.Male_Electors AS electors_male,
              t.Female_Electors AS electors_female,
              t.TG_Electors AS electors_tg,
              t.Total_Electors AS electors_total,
              t.Male_Voted AS voted_male,
              t.Female_Voted AS voted_female,
              t.TG_Voted AS voted_tg,
              t.Postal_Voted AS voted_postal,
              t.Total_Voted AS total_votes,
              t.Poll_Pct AS turnout_pct,
              t.NOTA_Votes AS nota_votes
            FROM `tn-election-2026-501004.tn_election_2026.dim_constituency` c
            LEFT JOIN RankedCandidates w ON c.AC_No = w.AC_No AND w.rank = 1
            LEFT JOIN `tn-election-2026-501004.tn_election_2026.dim_party` pw ON w.Party = pw.Party_Full
            LEFT JOIN RankedCandidates r ON c.AC_No = r.AC_No AND r.rank = 2
            LEFT JOIN `tn-election-2026-501004.tn_election_2026.dim_party` pr ON r.Party = pr.Party_Full
            LEFT JOIN `tn-election-2026-501004.tn_election_2026.fact_turnout_2026` t ON c.AC_No = t.AC_No
            ORDER BY c.AC_No
            """
            query_job = bq_client.query(query)
            results = query_job.result()
            constituencies = [dict(row) for row in results]
            logger.info(f"Fetched {len(constituencies)} constituencies from BigQuery.")
            return jsonify(constituencies)
        except Exception as e:
            logger.error(f"BigQuery constituencies query failed: {e}.")
            
@app.route('/api/party-winners', methods=['GET'])
def get_party_winners():
    if bq_client:
        try:
            query = """
            WITH RankedCandidates AS (
              SELECT 
                AC_No,
                Candidate,
                Party,
                Total_Votes,
                ROW_NUMBER() OVER (PARTITION BY AC_No ORDER BY Total_Votes DESC) as rank
              FROM `tn-election-2026-501004.tn_election_2026.fact_results_2026`
            )
            SELECT 
              COALESCE(p.Party_Short, w.Party) AS party_code,
              w.Party AS party_full,
              COUNT(*) AS seats_won
            FROM RankedCandidates w
            LEFT JOIN `tn-election-2026-501004.tn_election_2026.dim_party` p ON w.Party = p.Party_Full
            WHERE w.rank = 1
            GROUP BY w.Party, p.Party_Short
            ORDER BY seats_won DESC
            """
            query_job = bq_client.query(query)
            results = query_job.result()
            winners = [dict(row) for row in results]
            logger.info(f"Fetched {len(winners)} party seat counts from BigQuery.")
            return jsonify(winners)
        except Exception as e:
            logger.error(f"BigQuery party winners query failed: {e}.")
            
    # Fallback to local mockup based on alliance split
    fallback = [
        {"party_code": "TVK", "party_full": "Tamilaga Vettri Kazhagam", "seats_won": 108},
        {"party_code": "DMK", "party_full": "Dravida Munnetra Kazhagam", "seats_won": 59},
        {"party_code": "AIADMK", "party_full": "All India Anna Dravida Munnetra Kazhagam", "seats_won": 47},
        {"party_code": "INC", "party_full": "Indian National Congress", "seats_won": 5},
        {"party_code": "PMK", "party_full": "Pattali Makkal Katchi", "seats_won": 4},
        {"party_code": "IUML", "party_full": "Indian Union Muslim League", "seats_won": 2},
        {"party_code": "CPI", "party_full": "Communist Party of India", "seats_won": 2},
        {"party_code": "VCK", "party_full": "Viduthalai Chiruthaigal Katchi", "seats_won": 2},
        {"party_code": "CPI(M)", "party_full": "Communist Party of India (Marxist)", "seats_won": 2},
        {"party_code": "BJP", "party_full": "Bharatiya Janata Party", "seats_won": 1},
        {"party_code": "DMDK", "party_full": "Desiya Murpokku Dravida Kazhagam", "seats_won": 1},
        {"party_code": "AMMK", "party_full": "Amma Makkal Munnettra Kazagam", "seats_won": 1}
    ]
    return jsonify(fallback)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir:
        os.chdir(script_dir)
    
    PORT = 8000
    print(f"Serving election dashboard at http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=False)

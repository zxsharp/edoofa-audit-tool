# Edoofa Conversational Audit Engine: Executive Explainer

The **Edoofa Conversational Audit Engine** is a quality assurance and compliance dashboard designed to monitor and evaluate counselor-student interactions. Leveraging advanced AI parsing and auditing, the tool identifies critical conversational concerns that impact student conversion rates, parental trust, and Edoofa's brand reputation.

---

## 1. The CICR Audit Framework
The tool evaluates dialog exports against the **Conversational Integrity & Patient-Counselor Relations (CICR)** framework across seven key categories:

1. **FT (Financial Transparency):** Measures cost disclosures. Flagged when fee structures are hidden, delayed, or when counselors avoid direct payment questions.
2. **PC (Promise Contradiction):** Measures consistency. Flags contradictions between initial promises (e.g. "completely free") and later billing requirements.
3. **BV (Boundary Violations):** Measures empathy. Flags counselors who message families during explicitly requested personal downtime, holiday breaks, or life events (bereavement, Easter, church times).
4. **AUP (Artificial Urgency Pressure):** Measures selling ethics. Distinguishes legitimate university or visa deadlines from artificial counselor-enforced urgency (e.g., "pay by tonight to secure this rate").
5. **DTS (Defensive Tone Shifts):** Measures professionalism. Flags tone transitions from supportive mentor to hostile or aggressive when families ask critical credibility or financial questions.
6. **GC (Guilt & Coercion):** Measures pressure. Flags emotional manipulation, gaslighting, or questioning parent responsibility (e.g. "are you saying you cannot save $150 for your child's future?").
7. **AE (Authority Escalation):** Measures honesty. Flags using senior figures (e.g., "Program Director") for "congratulatory" or "academic" calls, when the actual purpose is to apply institutional pressure to close a transaction.

---

## 2. Risk Evaluation & Metrics
Each file receives:
- **Individual Metrics:** A score from 1 (fully compliant) to 10 (critical violation) for each category, color-coded by threat level.
- **Flagged Timeline View:** Highlighted conversation quotes that display the exact lines where a violation was made.
- **Cross-Student Synthesis:** For multi-file audits, the AI aggregates results to highlight systemic behavior, calculating a collective **Brand Reputation Risk** level (Low, Medium, High, Critical) and providing recommendations for counselor coaching.

---

## 3. How to Launch and Use the Tool
The engine is a serverless Single Page Application (SPA), operating entirely client-side for maximum data security.

1. **Serve the Application:**
   Open a terminal in the folder and start a simple web server:
   ```bash
   cd /home/ishansh/Desktop/SkyFly/Hacks/edoofa/audit_tool
   python3 -m http.server 8000
   ```
2. **Open in Browser:**
   Go to: `http://localhost:8000/index.html`
3. **Provide API Key:**
   Enter a valid Google Gemini API Key in the secure field in the header.
4. **Run Analysis:**
   Upload chat transcripts (`.txt` files) by drag-and-drop or browsing, then click **Analyze Conversations**.
5. **Review and Export:**
   Navigate reports in the sidebar. Click **Export JSON Report** to download the raw compliance data.

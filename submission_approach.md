# Edoofa Conversational Audit Engine: Submission & Approach Document

## 1. Executive Summary
The **Edoofa Conversational Audit Engine** is a unified quality assurance tool built to monitor, evaluate, and audit counselor-student interactions on WhatsApp. Consolidating a legacy split architecture into a single **Next.js (App Router)** codebase, it parses raw conversation transcripts in-memory, audits them against a custom 7-category ethical framework, and generates an interactive, glassmorphic dashboard representing compliance metrics, dialogue timelines, and cross-student systemic patterns.

---

## 2. The CICR Auditing Framework
The tool audits conversations against the **Conversational Integrity & Patient-Counselor Relations (CICR)** framework. It evaluates counselor dialogue across seven specific compliance categories:

### Categories and Operational Rationale

1. **FT (Financial Transparency):**
   - *Measures:* Timely and unambiguous cost disclosure.
   - *Edoofa Rationale:* Delaying cost disclosures builds false assumptions. If fees are introduced only after emotional investment is secured, it causes trust breakdown and student dropout.

2. **PC (Promise Contradiction):**
   - *Measures:* Consistency between early guarantees and actual billing constraints.
   - *Edoofa Rationale:* Edoofa operates on "all commitments are written and recorded". Discrepancies between promises (e.g. "completely free") and actual contracts damage institutional credibility.

3. **BV (Boundary Violations):**
   - *Measures:* Respect for tz timezone breaks and requested personal downtime (Easter, bereavement, funerals).
   - *Edoofa Rationale:* Contacting families during grieving or spiritual times and demanding replies shows a lack of empathy and violates counselor-student boundary boundaries.

4. **AUP (Artificial Urgency Pressure):**
   - *Measures:* Counselor-fabricated urgency (e.g., "pay in 2 hours or your file closes") vs. legitimate external deadlines.
   - *Edoofa Rationale:* Legitimate academic or immigration deadlines are valid constraints; counselor-invented deadlines are coercive high-pressure sales tactics.

5. **DTS (Defensive Tone Shifts):**
   - *Measures:* Maintenance of supportive mentorship tone when challenged.
   - *Edoofa Rationale:* Counselors are academic mentors. Shifting to defensive, long, or hostile paragraphs when program fees or credibility are questioned signals sales-driven motives.

6. **GC (Guilt & Coercion):**
   - *Measures:* Gaslighting, guilt-tripping, or questioning parent dedication (e.g. "can you not even save $150?").
   - *Edoofa Rationale:* Emotional manipulation creates parent resentment and trust failure.

7. **AE (Authority Escalation):**
   - *Measures:* Bringing in senior figures (e.g., "Program Director") under congratulatory pretexts to apply closing pressure.
   - *Edoofa Rationale:* Misleading students about the academic nature of a call to extract financial commitments is a coercive authority tactic.

---

## 3. Technical Implementation & Architecture

The application combines a high-fidelity frontend with serverless processing routes in a single repository:

### A. Regex-Based Dialogue Parser
- Implemented in `src/utils/parser.js`.
- Uses regular expressions to match standard WhatsApp export lines (`DD/MM/YY, H:MM [am/pm] - Sender: Content`).
- Automatically handles multiline messages by appending trailing text to the last active speaker bubble.
- Distinguishes dialogue messages from system events (e.g. "Messages are end-to-end encrypted") to prevent parsing noise.
- Assigns sequential unique IDs to messages, allowing the auditing engine to cite exact supporting dialogue quotes.

### B. Gemini API Prompt Orchestration
- Implemented in `src/utils/analyzer.js` using the official `@google/generative-ai` SDK.
- Connects to the stable, production-ready `/v1/` endpoint to resolve the legacy `v1beta` `404` model-not-found error.
- Enforces strict JSON response schemas via `generationConfig.responseMimeType` to return clean structured payloads directly mapping findings to supporting message IDs.
- For multi-file uploads, runs a secondary **Cross-Student Synthesis** that filters out heavy message arrays and feeds individual findings back to Gemini to isolate systemic compliance risks.

### C. App Router Serverless Route
- Implemented in `src/app/api/audit/route.js`.
- Consolidates file reception, parsing, individual analysis, and pattern synthesis into a single serverless transaction.
- In-memory data flow ensures no local disk writing, maximizing compliance and data security.

### D. Premium Glassmorphic Frontend
- Implemented in `src/app/page.js` with styles in `src/app/globals.css`.
- Integrates Google Outfit typography natively using Next.js `next/font/google` to resolve PostCSS `@import` rule-ordering issues.
- Implements hydration-safe API key management using browser `localStorage`.
- Includes a dynamic dropdown allowing the auditor to select the Gemini model at runtime (e.g. `gemini-1.5-flash` or `gemini-1.5-pro`).
- Displays aggregated systemic patterns, individual metrics (1-10), colored severity badges, and an interactive dialogue timeline matching the designs.

---

## 4. Key Design Decisions & Trade-Offs

- **Next.js app route consolidation:** Choosing Next.js over separate React/Express folders simplifies deployment, unified styling dependencies, and avoids CORS configuration complexities.
- **Client-Side API Key Management:** By passing the Gemini API key through secure request headers and storing it only in browser `localStorage`, the server remains fully stateless, eliminating server-side credential leak risks.
- **No Local File Storage:** Chat transcripts are read and parsed purely in memory on the server side, ensuring student-parent privacy guidelines are maintained.

---

## 5. Local Setup & Verification Steps

1. **Navigate to the project:**
   ```bash
   cd audit_tool
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the local server:**
   ```bash
   npm run dev
   ```
4. **Access the application:**
   Open `http://localhost:3000` in the browser, paste your Gemini API key in the header configuration bar, select the model, upload the chat files, and click **Start Compliance Audit**.

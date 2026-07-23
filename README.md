# Edoofa Conversational Audit Engine (ECAE)

The **Edoofa Conversational Audit Engine** is a compliance and quality assurance dashboard designed to monitor, evaluate, and audit counselor-student interactions. As Edoofa grows, maintaining the highest standards of professional guidance, trust, and empathy is critical. 

This tool parses raw WhatsApp chat exports and audits them using advanced LLMs (Gemini) against the **CICR (Conversational Integrity & Patient-Counselor Relations)** framework. It detects predatory, high-pressure, or coercive sales tactics, maps long-term conversation patterns, and aggregates findings across multiple student files to identify systemic behavior.

---

## 📋 The CICR Audit Framework

The Conversational Integrity & Patient-Counselor Relations (CICR) framework evaluates the alignment of counselor interactions with Edoofa's core values. Each conversation is scored from **1 (Fully Compliant)** to **10 (Critical Violation)** across 7 categories:

### 1. Financial Transparency (FT)
* **What it Measures:** Complete, clear, and upfront disclosure of all fee structures, milestones, and auxiliary costs.
* **Why it Matters:** Delays in disclosing fees or hiding secondary charges (e.g. bank transfer fees, exchange rates) to build emotional investment first leads to sticker shock and destroys student trust.
* **Key Metrics:** 
  * *Misalignment Interval (MI):* The distance (in messages or days) between a student stating a false financial assumption and the counselor explicitly correcting it.
  * *Hidden Fees Ratio (HFR):* The latency/avoidance of outlining secondary payment details until checkout.

### 2. Promise Contradiction (PC)
* **What it Measures:** Consistency between early guarantees (verbal or written) and subsequent billing conditions.
* **Why it Matters:** Edoofa operates on the principle that "All commitments are written and recorded". Discrepancies between initial promises (e.g. "completely free", "no fees") and actual contracts damage institutional credibility.
* **Key Metrics:** 
  * *Contradiction Delta (CD):* Any instance where early guarantees are contradicted by billing terms, or where counselors avoid addressing refund and policy queries.

### 3. Boundary Violations (BV)
* **What it Measures:** Respect for the parent and student's personal boundaries, local timezone rest hours, and critical life events.
* **Why it Matters:** Contacting parents during explicitly requested offline times (e.g., family bereavement, church, holidays like Easter) and demanding instant replies violates basic counseling ethics.
* **Key Metrics:**
  * *Intrusion Count (IC):* The number of counselor-initiated messages sent during requested offline slots.
  * *Off-Hours Pinging (OHP):* High-pressure messages sent outside standard working hours (after 6:00 PM CAT) or on Sunday mornings.

### 4. Artificial Urgency Pressure (AUP)
* **What it Measures:** The presence of fake, counselor-enforced transaction deadlines.
* **Why it Matters:** Forcing a family's financial decisions using arbitrary deadlines is a high-pressure sales tactic. Legitimate university registration or visa deadlines are valid; counselor-invented deadlines are not.
* **Key Metrics:**
  * *Threat-Based Urgency (TBU):* Deadline pressure paired with the threat of closing the student's file (e.g. "reply in 2 hours or your seat is forfeited").
  * *Legitimate vs. Artificial Verification (LAV):* Cross-referencing counselor deadlines against verified academic schedules.

### 5. Defensive Tone Shifts (DTS)
* **What it Measures:** The shift in counselor professionalism when challenged on program details or costs.
* **Why it Matters:** Counselors are educators and mentors. If their tone turns defensive, cold, or transactional when credibility or fees are questioned, it reveals a sales-first rather than student-first mindset.
* **Key Metrics:**
  * *Defensiveness Index (DI):* Argumentative paragraphs or pushback sent in response to student/parent skepticism.
  * *Persona Divergence (PD):* The gap between initial warm welcome messages and later cold, rigid responses.

### 6. Guilt & Coercion (GC)
* **What it Measures:** Empathy and positive emotional engagement.
* **Why it Matters:** Emotional manipulation, gaslighting, or guilt-tripping parents regarding their educational commitment damages relationships and creates deep resentment.
* **Key Metrics:**
  * *Financial Guilt-Tripping (FGT):* Insinuating a family's lack of priority or responsibility because they cannot afford or question a fee (e.g. "are you saying you cannot save $150 for your child's future?").
  * *Educational Coercion (EC):* Suggesting a student will remain "idle" or fail in life if they do not join Edoofa.

### 7. Authority Escalation (AE)
* **What it Measures:** Transparency and honesty in roles.
* **Why it Matters:** Scheduling calls with senior figures (e.g., "Program Director") under academic/congratulatory pretenses, where the actual hidden agenda is to apply institutional pressure and resolve payment roadblocks.
* **Key Metrics:**
  * *Authority Closing Rate (ACR):* Bringing in authority figures specifically to extract payment commitments.

---

## 🛠️ Technical Architecture

ECAE is built as a single, unified web application using the **Next.js App Router** architecture:

```
audit_tool/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── audit/
│   │   │       └── route.js    # Next.js POST API endpoint
│   │   ├── globals.css         # Custom Premium CSS (glassmorphism/dark-mode)
│   │   ├── layout.js           # App Shell and Metadata
│   │   └── page.js             # Interactive Dashboard (React Client Component)
│   └── utils/
│       ├── analyzer.js         # Google Generative AI Prompt & SDK Interface
│       └── parser.js           # WhatsApp chat transcript parser
├── postcss.config.js
├── tailwind.config.js          # Styling configurations
├── package.json
└── .env                        # Local environment settings
```

### Key Technical Flow
1. **Parser (`parser.js`):** Receives the raw `.txt` file contents, parses line-by-line, uses regex to identify date/time/sender, extracts message dialogue, handles multiline messages, and logs system events separately.
2. **Analyzer (`analyzer.js`):** Interfaces with the `@google/generative-ai` SDK. Feeds the structured messages into the Gemini API along with the CICR framework using system prompts configured for JSON output.
3. **Cross-Student Engine:** If multiple chats are audited, the backend strips heavy dialogue arrays, summarizes individual findings, and invokes the model again to compile a **Systemic Pattern Analysis** containing Brand Risk and Actionable Coaching Recommendations.
4. **Interactive UI (`page.js`):** A premium glassmorphic UI offering:
   * Secure Gemini API Key entry input (stored safely in browser's local storage).
   * Drag-and-drop workspace for multiple chat files.
   * Comprehensive sidebar audit navigator to switch between individual reports and the global systemic pattern view.
   * Tab switches to inspect structured findings or review the **Flagged Conversation Stream** highlighting exactly where violations occurred in the chat.
   * JSON compliance report download feature.

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js**: Version 18.x or above (required due to modern ECMAScript features like nullish coalescing `??` and optional chaining `?.` used by Next.js and Turbopack).
* **npm** or **yarn**

> [!WARNING]
> **Build Troubleshooting:** If you run `npm run build` or `npm run dev` and encounter a `SyntaxError: Unexpected token '?'` error from files inside `.next/build/chunks/...`, this means your shell is using an outdated global Node version (e.g. Node 12). Please upgrade Node.js to v18+ or ensure the newer Node path is prepended to your shell's `PATH` variable.

### Installation Steps

1. **Clone & Navigate:**
   ```bash
   cd /home/ishansh/Desktop/SkyFly/Hacks/edoofa/audit_tool
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional):**
   You can provide a default Gemini API key by editing the local environment file:
   * Create or edit `.env` in the root folder:
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key
     ```
   * Alternatively, you can input the Gemini API Key directly in the frontend header inputs. It will be stored securely in your browser's local storage for subsequent runs.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

5. **Production Build & Start:**
   To build the production bundle:
   ```bash
   npm run build
   npm run start
   ```

---

## 💻 How to Audit Conversations

1. Open `http://localhost:3000` in your web browser.
2. Enter your **Gemini API Key** in the input field in the top-right header (unless already configured in `.env`).
3. Select your preferred model (e.g. `gemini-1.5-flash` or `gemini-1.5-pro`).
4. Drag and drop one or more WhatsApp chat export `.txt` files into the upload zone (or click to browse).
5. Click **Start Compliance Audit**.
6. Review findings:
   * **Systemic Patterns:** Displays when auditing 2+ files. Identifies recurring issues across counselors, total brand risk, and coaching actions.
   * **Individual Reports:** Inspect metrics scored 1–10, view detailed rationales for each flag, and trace quotes directly back to the timeline under the **Flagged Conversation Stream** tab.
   * **Export:** Download the audit report as a JSON file by clicking **Export Audit Data**.

Subject: Submission: Edoofa Technical & Quality Audit Exercise - [Your Name]

Dear Edoofa Team,

Please find below my submission for both the Data Round and the Conversational Audit Tool Round. I have shared edit access to the Google Sheet containing Problem 1 deliverables with techsupport@edoofa.com.

---

### Part 1: Data Round (Google Sheets)
- **Google Sheets Link:** [INSERT YOUR GOOGLE SHEET SHARE LINK HERE - Shared with Edit Access to techsupport@edoofa.com]
- **Implementation Approach:**
  - **Tab 1 (Cleaned Data):** Consists of 100% formula-driven cells pulling directly from the raw export. Cleans casing, standardizes currency values to USD (using nested functions to handle variable INR/USD patterns and a fixed exchange rate of 80 INR/USD), standardizes dates to `DD-Mon-YYYY`, and dynamically identifies duplicate IDs.
  - **Tab 2 (Analysis):** Houses dynamic summary tables utilizing `SUMIFS`, `COUNTIFS`, and date calculations:
    - *Table 1 (Counsellor Performance):* Distribution of counselor portfolios sorted by student counts.
    - *Table 2 (Country & Fee Overview):* Country-wise view of enrollment size, total fees, collections, and outstanding balances.
    - *Table 3 (Pipeline Tracker):* Dynamic pipeline urgency prioritization showing students within 7-day deadlines, post-deadline, and overdue, sorted by missed deadlines.

---

### Part 2: Audit Tool Round (WhatsApp Compliance Auditing)
I have built and configured a **unified Next.js (App Router)** compliance engine styled with a premium glassmorphic dark theme and custom Tailwind styling.

- **Deployed Prototype Link:** [INSERT YOUR DEPLOYED URL HERE - e.g., Vercel Link]
- **Walkthrough Screen Recording (Video):** [INSERT YOUR 5-10 MIN WALKTHROUGH VIDEO LINK HERE]
- **One-Page Explainer Document:** Linked here or attached as [explainer.md](file:///home/ishansh/Desktop/SkyFly/Hacks/edoofa/audit_tool/explainer.md) in the project root.
- **Audit Framework (CICR):**
  Audits conversation logs across 7 compliance categories:
  1. **FT (Financial Transparency):** Cost delay/omission and hidden bank/exchange rate fees.
  2. **PC (Promise Contradiction):** Early verbal/written guarantees vs. contract billing terms.
  3. **BV (Boundary Violations):** Off-hours contact and pinging during funerals/Easter.
  4. **AUP (Artificial Urgency):** Counselor-fabricated deadlines vs. valid university/visa dates.
  5. **DTS (Defensive Tone Shift):** Abrupt shifts from nurturing mentor to transactional/hostile.
  6. **GC (Guilt & Coercion):** Guilt-tripping parents' priorities or educational commitment.
  7. **AE (Authority Escalation):** Using senior figures under congratulatory pretexts to close payments.

- **Key Findings on Provided Logs:**
  - **Chat 1 Audit:** High violation on **BV** (counselor messaging during a family bereavement/memorial service) and **AUP** (fake 2-hour deadline to sign up).
  - **Chat 2 Audit:** Critical violation on **BV** (pressure messages over Easter weekend) and **GC** (guilt-tripping a single parent with financial capacity remarks: *"are you saying you cannot save $150?"*).

---

### Key Technical Decisions & Project Repository
- **Single Next.js Repository:** Fully consolidated the parser, Gemini analyzer, backend server routes (`/api/audit`), and React UI into one folder, allowing effortless local boot (`npm run dev`) and serverless cloud deployment.
- **Dynamic Model Selection:** Integrated a runtime dropdown so auditors can switch between `gemini-1.5-flash` and `gemini-1.5-pro` based on their budget/context requirements.
- **Client-Side Key Security:** To prevent API key leaks, credentials remain purely local inside the user's browser `localStorage` and are only passed over HTTPS headers.

Please let me know if you have any questions or when we can schedule the design and formula walk-through.

Best regards,

[Your Name]  
[Your Contact Information]

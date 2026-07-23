import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Runs the conversational audit using Gemini API.
 * @param {Array} messages - Structured message array from parser
 * @param {string} apiKey - Gemini API Key provided by user
 * @param {string} modelName - Model ID (e.g. gemini-1.5-flash, gemini-1.5-pro)
 * @returns {Object} Structured audit report
 */
export async function analyzeChat(messages, apiKey, modelName = 'gemini-1.5-flash') {
  if (!apiKey) {
    throw new Error('Gemini API key is required to run the analysis.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
You are an expert quality auditor for Edoofa, an organization that connects African students with affordable higher education in India through a merit-based scholarship and the "Earn While You Learn" (EWYL) skill-building model.

Edoofa prides itself on trust, transparency, and empathetic student mentorship. However, some counselors may slip into predatory, coercive, and high-pressure sales tactics. Your task is to audit the provided WhatsApp conversation and identify patterns of concern.

---

### Audit Framework: Conversational Integrity & Patient-Counselor Relations (CICR)

Evaluate the conversation against these 7 specific categories. For each category, assign a violation severity score from 1 to 10 (1 = perfect ethical alignment/no concern, 10 = critical ethical violation/extremely coercive).

1. **FT (Financial Transparency):**
   - Measures: Complete and upfront disclosure of all costs, payments, and terms.
   - Violations: Delays or omissions in disclosing the fee schedule, hidden costs (e.g., bank transfer fees, exchange rates), or avoiding direct answers.

2. **PC (Promise Contradiction):**
   - Measures: Alignment between early verbal/written commitments and later demands.
   - Violations: Mismatches between early assurances (e.g. "free tuition/accommodation", "only pay flight tickets") and later fee conditions, or failing to address student/parent confusion regarding contradictions.

3. **BV (Boundary Violations):**
   - Measures: Respect for personal schedules, religious holidays, and life events.
   - Violations: Pinging families during explicitly requested offline times (bereavement, religious holidays like Easter, family church times) and demanding responses.

4. **AUP (Artificial Urgency Pressure):**
   - Measures: The use of artificial sales urgency.
   - Violations: Fake deadlines (e.g., "pay by tonight to lock the current fee structure" or "if you do not participate today, I will close your application").
   - NOTE: Distinguish this from legitimate external deadlines. If the counselor references real university application deadlines or visa processing dates (backed by actual operational data), count it as legitimate. If it is counselor-enforced to secure a sale, it is a violation.

5. **DTS (Defensive Tone Shifts):**
   - Measures: Maintenance of professional, empathetic mentorship.
   - Violations: Shifting from a warm/nurturing tone to a transactional, hostile, or highly argumentative tone, particularly when the client questions the program's credibility or refers to it as a "sale".

6. **GC (Guilt & Coercion):**
   - Measures: Positive emotional engagement.
   - Violations: Guilt-tripping, gaslighting, or questioning a parent's commitment to their child's education or financial priorities (e.g., "tertiary education starts early... are you not even able to save $150-200?").

7. **AE (Authority Escalation):**
   - Measures: Honest, non-manipulative communication.
   - Violations: Introducing a senior figure (like the "Program Director") for a "congratulatory" or "academic" call, when the primary objective is to apply institutional pressure to resolve a financial roadblock.

---

### Input Data
Below is the parsed WhatsApp conversation JSON:
${JSON.stringify(messages, null, 2)}

---

### Output JSON Format Requirements
Return a JSON object matching this schema exactly. Do not wrap in markdown blocks, return raw JSON only.

{
  "metrics": {
    "FT": { "score": 1, "description": "Short explanation of FT score." },
    "PC": { "score": 1, "description": "Short explanation of PC score." },
    "BV": { "score": 1, "description": "Short explanation of BV score." },
    "AUP": { "score": 1, "description": "Short explanation of AUP score." },
    "DTS": { "score": 1, "description": "Short explanation of DTS score." },
    "GC": { "score": 1, "description": "Short explanation of GC score." },
    "AE": { "score": 1, "description": "Short explanation of AE score." }
  },
  "overallSummary": "A high-level summary (3-4 sentences) outlining the counselor's performance, major areas of concern, and relationship dynamics.",
  "findings": [
    {
      "category": "FT|PC|BV|AUP|DTS|GC|AE",
      "severity": "Low|Medium|High|Critical",
      "issue": "Brief description of the specific issue (e.g., 'Disregard for bereavement boundaries').",
      "rationale": "Detailed explanation of why this matters, how it impacts the family, and how it violates Edoofa's values.",
      "messages": [
        {
          "id": 12,
          "sender": "Career Counselor",
          "text": "Exact message snippet text"
        }
      ]
    }
  ]
}

Please ensure that you extract patterns that span across MULTIPLE messages. Ground each finding with the exact message IDs and text.
`;

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const cleanText = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error calling Gemini API in analyzer.js:', error);
    throw new Error(`Failed to audit chat: ${error.message}`);
  }
}

/**
 * Analyzes patterns across multiple student audit reports.
 * @param {Array} individualReports - List of reports returned from analyzeChat
 * @param {string} apiKey - Gemini API Key
 * @param {string} modelName - Gemini Model name
 * @returns {Object} Structured cross-student pattern analysis
 */
export async function analyzeCrossStudentPatterns(individualReports, apiKey, modelName = 'gemini-1.5-flash') {
  if (!apiKey) {
    throw new Error('Gemini API key is required to run the cross-student analysis.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
You are a senior quality auditor at Edoofa. You are reviewing the audit findings of multiple career counselors communicating with different students/families.

Here are the individual student audit reports:
${JSON.stringify(individualReports, null, 2)}

Identify systemic patterns of concern that span across multiple students/conversations. For example:
- Are multiple counselors violating boundaries during weekends or holidays?
- Is there a widespread lack of transparency regarding fees early in the funnel?
- Are multiple counselors using authority figures (Directors) to push financial decisions?
- What is the collective severity and risk level to Edoofa's brand reputation?

Return a JSON object matching this schema exactly. Do not wrap in markdown blocks, return raw JSON only.

{
  "systemicPatterns": [
    {
      "patternName": "Description of the pattern (e.g., 'Holiday boundary violations')",
      "frequency": "High|Medium|Low",
      "impact": "Explanation of why this is a systemic risk for Edoofa.",
      "evidenceSummary": "Summary of the specific findings from the individual chats that support this pattern."
    }
  ],
  "brandReputationRisk": "Low|Medium|High|Critical",
  "recommendations": [
    "Actionable recommendation for training or policy changes based on these patterns."
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const cleanText = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error in cross-student analysis:', error);
    return {
      systemicPatterns: [],
      brandReputationRisk: 'Low',
      recommendations: ['Could not generate cross-student recommendations due to an API error.']
    };
  }
}

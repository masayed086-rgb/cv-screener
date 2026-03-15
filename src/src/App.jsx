import { useState, useEffect, useCallback } from "react";

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
);

const DEFAULT_JD = `Role: Mobility Strategy & Corporate Development (MSCD) Intern

Requirements:
- Python/R, SQL for data extraction and manipulation
- Tableau/Power BI for interactive dashboards
- Advanced Excel (pivot tables, VBA)
- Business acumen / strategy frameworks (Porter's Five Forces, market sizing)
- Penultimate or final year undergraduate preferred
- Major in CS, Data Science/Analytics, or related field
- Market research and strategic analysis experience
- Strong communication and storytelling skills`;

const VERDICT_OPTIONS = ["Strong Yes", "Yes", "Maybe", "No"];

const VERDICT_STYLE = {
  "Strong Yes": {
    bg: "#052e16",
    border: "#16a34a",
    text: "#4ade80",
    badge: "#166534",
  },
  Yes: { bg: "#0d2b1a", border: "#22c55e", text: "#86efac", badge: "#14532d" },
  Maybe: {
    bg: "#271800",
    border: "#d97706",
    text: "#fbbf24",
    badge: "#92400e",
  },
  No: { bg: "#1f0808", border: "#ef4444", text: "#fca5a5", badge: "#7f1d1d" },
};

const SCORE_KEYS = [
  "technical",
  "analytics",
  "experience",
  "businessAcumen",
  "communication",
];
const SCORE_LABELS = {
  technical: "Coding Skills",
  analytics: "Data & Analytics",
  experience: "Work Experience",
  businessAcumen: "Business Acumen",
  communication: "Communication",
};

const DEFAULT_CANDIDATES = [
  {
    id: "c1",
    fileLabel: "B1-01",
    name: "Varshini Karthikeyan",
    note: "⚠️ File mislabeled as Adilakshmi Vasudevan",
    degree: "BBA Finance, NUS (2023–2027)",
    year: "Penultimate",
    major: "Finance",
    verdict: "Maybe",
    verdictReason:
      "Strong finance & strategy profile but limited coding/data skills for this technical role.",
    scores: {
      technical: 5,
      analytics: 6,
      experience: 8,
      businessAcumen: 9,
      communication: 8,
    },
    strengths: [
      "PE internship (Proterra, AVARY)",
      "Financial modelling & DCF",
      "Market research across 5+ industries",
      "Strategy exposure via 180DC",
    ],
    gaps: [
      "No Python/SQL demonstrated",
      "No Tableau/Power BI",
      "Finance-heavy, not data/CS background",
    ],
    techStack: ["Excel", "Power BI", "MySQL", "Python (basic)", "HTML"],
  },
  {
    id: "c2",
    fileLabel: "B1-02",
    name: "Li Chenxi",
    note: "",
    degree: "MSc Smart Industries & Digital Transformation, NUS",
    year: "Postgrad",
    major: "Information Management / Supply Chain",
    verdict: "Maybe",
    verdictReason:
      "Solid Python/data skills and supply chain domain knowledge, but postgrad and weaker on dashboards.",
    scores: {
      technical: 7,
      analytics: 8,
      experience: 7,
      businessAcumen: 7,
      communication: 7,
    },
    strengths: [
      "Python (Pandas, SQLAlchemy)",
      "Tableau dashboards",
      "10,000+ row data cleaning",
      "Supply chain & procurement experience",
    ],
    gaps: ["Postgrad candidate", "No Power BI", "Limited strategic analysis"],
    techStack: ["Python", "MySQL", "Tableau", "ERP", "Hadoop", "Spark"],
  },
  {
    id: "c3",
    fileLabel: "B1-03",
    name: "Yueying Pi",
    note: "",
    degree: "MSc Computer Engineering, NUS (2025–2026)",
    year: "Postgrad",
    major: "Computer Engineering",
    verdict: "Maybe",
    verdictReason:
      "Excellent technical/ML skills but postgrad with limited business strategy exposure.",
    scores: {
      technical: 9,
      analytics: 9,
      experience: 7,
      businessAcumen: 5,
      communication: 7,
    },
    strengths: [
      "Python, SQL, C++, MATLAB",
      "Power BI, Tableau, Matplotlib",
      "ML models (LSTM, PINN, MADDPG)",
      "Feature engineering at CCB internship",
    ],
    gaps: [
      "Postgrad candidate",
      "Minimal business/strategy experience",
      "No mobility/market research background",
    ],
    techStack: [
      "Python",
      "SQL",
      "PyTorch",
      "TensorFlow",
      "Power BI",
      "Tableau",
      "Docker",
    ],
  },
  {
    id: "c4",
    fileLabel: "B1-06",
    name: "Wai Keet Chow (Steve)",
    note: "",
    degree: "MSc Smart Industries & Digital Transformation, NUS (2025–2026)",
    year: "Postgrad",
    major: "Civil Engineering → Cloud/Tech Strategy",
    verdict: "Maybe",
    verdictReason:
      "Excellent strategy & B2B experience but postgrad with weak coding/analytics depth.",
    scores: {
      technical: 5,
      analytics: 5,
      experience: 9,
      businessAcumen: 9,
      communication: 8,
    },
    strengths: [
      "6 years cloud/tech industry (AWS, Azure, GCP)",
      "USD 1M+ account management",
      "Digital transformation strategy",
      "Strong client-facing communication",
    ],
    gaps: [
      "Postgrad (overqualified for intern)",
      "Python/SQL only at basic level",
      "No Tableau/Power BI demonstrated",
    ],
    techStack: ["Python (basic)", "Tableau (basic)", "IBM SPSS", "Excel"],
  },
  {
    id: "c5",
    fileLabel: "B1-06",
    name: "Yong En Heng",
    note: "",
    degree: "BSocSci Economics, NUS (2023–2027)",
    year: "Penultimate",
    major: "Economics",
    verdict: "Maybe",
    verdictReason:
      "Strong market research & real estate analytics; some Python/Power BI but not CS-major depth.",
    scores: {
      technical: 6,
      analytics: 7,
      experience: 8,
      businessAcumen: 8,
      communication: 8,
    },
    strengths: [
      "Market intelligence internship at Gamuda Land (500+ assets)",
      "Cross-country macro research",
      "Geospatial tools, AppSheet, Google Maps APIs",
      "180DC consulting, financial modelling",
    ],
    gaps: [
      "Economics major (not CS/Data)",
      "Python/SQL not deeply demonstrated",
      "No Tableau specifically",
    ],
    techStack: ["Python", "Stata", "Excel VBA", "Power BI"],
  },
  {
    id: "c6",
    fileLabel: "B1-07",
    name: "Karen Loh",
    note: "",
    degree: "BBA Finance & Marketing, NUS (2024–2027)",
    year: "Year 1/2",
    major: "Finance & Marketing",
    verdict: "No",
    verdictReason:
      "Finance/marketing profile with limited coding depth; not in penultimate/final year.",
    scores: {
      technical: 5,
      analytics: 6,
      experience: 7,
      businessAcumen: 7,
      communication: 8,
    },
    strengths: [
      "Financial consulting experience",
      "Digital marketing analytics",
      "SAP, Salesforce, Power BI",
      "CFA Level 1 candidate",
    ],
    gaps: [
      "Not penultimate/final year",
      "No Python/SQL depth",
      "Finance-focused, not data/CS",
    ],
    techStack: ["Excel", "Power BI", "SAP", "Salesforce", "Looker Studio"],
  },
  {
    id: "c7",
    fileLabel: "B1-09",
    name: "Julian Wee",
    note: "",
    degree: "BBA Finance, NUS (Aug 2025–present)",
    year: "Year 1",
    major: "Finance",
    verdict: "No",
    verdictReason:
      "Just started university; no coding or data skills demonstrated.",
    scores: {
      technical: 3,
      analytics: 3,
      experience: 5,
      businessAcumen: 5,
      communication: 7,
    },
    strengths: [
      "UAT banking experience at UOB",
      "Finance exposure",
      "Multiple leadership CCA roles",
    ],
    gaps: [
      "Year 1 — not penultimate/final",
      "No Python/SQL/R",
      "No Tableau/Power BI",
    ],
    techStack: ["Microsoft Office", "Canva"],
  },
  {
    id: "c8",
    fileLabel: "B1-10",
    name: "Yasaswi Jaiswal",
    note: "",
    degree: "BEng Electrical Engineering (Industry 4.0), NUS (2023–2027)",
    year: "Penultimate",
    major: "Electrical Engineering",
    verdict: "No",
    verdictReason:
      "Strong engineering/coding skills but no business acumen or market strategy experience.",
    scores: {
      technical: 7,
      analytics: 6,
      experience: 6,
      businessAcumen: 4,
      communication: 6,
    },
    strengths: [
      "Java, Python, C++, React.js, Node.js",
      "FPGA embedded systems project",
      "Industrial cybersecurity internship",
      "Software dev (Orbital project)",
    ],
    gaps: [
      "No Tableau/Power BI",
      "No SQL demonstrated",
      "No market research or business strategy",
    ],
    techStack: [
      "Python",
      "Java",
      "C++",
      "React.js",
      "Node.js",
      "Verilog",
      "MATLAB",
    ],
  },
  {
    id: "c9",
    fileLabel: "B1-11",
    name: "Xiaoyang Jing",
    note: "",
    degree:
      "BEng Engineering Science + BSc Data Science & Analytics, NUS (2023–2027)",
    year: "Penultimate",
    major: "Engineering Science / Data Science & Analytics",
    verdict: "Strong Yes",
    verdictReason:
      "Top candidate — dual degree, Power BI/SQL/Python, strong internships with measurable business impact, sole Wharton exchange candidate, GPA 4.73.",
    scores: {
      technical: 8,
      analytics: 8,
      experience: 8,
      businessAcumen: 7,
      communication: 8,
    },
    strengths: [
      "Python, R, SQL, MATLAB, Excel VBA, Power BI",
      "Thermo Fisher: Python-SQL-Power BI automation (saved 30 min/day)",
      "HP internship: Excel macros, market analysis, product launch",
      "Wharton/Engineering exchange (sole NUS CDE candidate)",
      "GPA 4.73/5",
    ],
    gaps: [
      "No Tableau (has Power BI)",
      "Limited direct strategy/consulting experience",
    ],
    techStack: [
      "Python",
      "R",
      "SQL",
      "MATLAB",
      "Java",
      "Excel VBA",
      "Power BI",
    ],
  },
  {
    id: "c10",
    fileLabel: "B1-12",
    name: "Darius Wong",
    note: "",
    degree: "BComp Information Systems, NUS (2024–present)",
    year: "Year 2",
    major: "Information Systems",
    verdict: "Maybe",
    verdictReason:
      "Solid IS/software background with Tableau experience; lacks strategic analysis depth.",
    scores: {
      technical: 7,
      analytics: 6,
      experience: 6,
      businessAcumen: 6,
      communication: 7,
    },
    strengths: [
      "Full-stack development (Django, Next.js)",
      "Tableau dashboard (Beijing property market)",
      "Requirements analysis & UAT at CloudMile",
      "Client-facing experience",
    ],
    gaps: [
      "Year 2 — not penultimate/final",
      "Limited Python/SQL depth for analytics",
      "No direct strategy or market intelligence work",
    ],
    techStack: ["Python", "Java", "SQL", "Tableau", "React/Next.js", "Django"],
  },
  {
    id: "c11",
    fileLabel: "B1-12",
    name: "Zichao Chen",
    note: "",
    degree: "MFE (Master of Financial Engineering), NUS (2025–present)",
    year: "Postgrad",
    major: "Financial Engineering",
    verdict: "Maybe",
    verdictReason:
      "Strong quant/Python skills but postgrad and finance-quantitative focus rather than market strategy.",
    scores: {
      technical: 8,
      analytics: 8,
      experience: 7,
      businessAcumen: 6,
      communication: 6,
    },
    strengths: [
      "Python for VaR/ES strategies, backtesting (QuantConnect, JoinQuant)",
      "Real-time monitoring website (Apache Tomcat)",
      "TCN-LSTM model for risk scoring (90%+ accuracy)",
      "MySQL, Java, R, MATLAB",
    ],
    gaps: [
      "Postgrad (not undergrad)",
      "No Tableau/Power BI",
      "Quant finance focus, not market/strategic analysis",
    ],
    techStack: ["Python", "Java", "C/C++", "MySQL", "R", "MATLAB"],
  },
  {
    id: "c12",
    fileLabel: "B1-13",
    name: "Xu Yimiao",
    note: "",
    degree: "BSc Data Science & Analytics (Hons), NUS (2025–2029)",
    year: "Year 1",
    major: "Data Science & Analytics",
    verdict: "No",
    verdictReason:
      "Year 1 with no relevant work experience or technical skills demonstrated.",
    scores: {
      technical: 2,
      analytics: 2,
      experience: 1,
      businessAcumen: 2,
      communication: 5,
    },
    strengths: [
      "Enrolled in relevant DSA degree at NUS",
      "Active CCA involvement",
    ],
    gaps: [
      "Year 1 — very early stage",
      "No coding or analytics experience",
      "No internships or projects",
    ],
    techStack: [],
  },
  {
    id: "c13",
    fileLabel: "B1-13",
    name: "Chou Chan Sovita",
    note: "",
    degree:
      "BSc Applied Mathematics + Second Major Data Analytics, NTU (2023–2027)",
    year: "Penultimate",
    major: "Applied Mathematics / Data Analytics",
    verdict: "Yes",
    verdictReason:
      "Strong match — penultimate year with full JD tech stack demonstrated, ML projects framed as business cases, finance analytics internship.",
    scores: {
      technical: 8,
      analytics: 8,
      experience: 6,
      businessAcumen: 6,
      communication: 7,
    },
    strengths: [
      "Python, R, SQL, Tableau, Excel, Power BI — full JD tech stack",
      "Logistic regression, CART, kNN, SVM models",
      "Finance & Analytics intern at CAELCIM (revenue forecasting)",
      "Projects framed as business cases",
    ],
    gaps: [
      "Limited market research / mobility industry exposure",
      "Internship relatively short and finance-focused",
    ],
    techStack: ["Python", "R", "SQL", "Tableau", "Power BI", "Excel", "MATLAB"],
  },
];

const uid = () => "c" + Math.random().toString(36).slice(2, 9);
const avgScore = (s) =>
  Object.values(s).reduce((a, b) => a + b, 0) / Object.values(s).length;

// ── API Key Modal ─────────────────────────────────────────────────────────────
function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState("");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#0f0f1a",
          border: "1px solid #6366f1",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#f1f5f9",
            fontFamily: "'Syne',sans-serif",
            marginBottom: 8,
          }}
        >
          Enter Anthropic API Key
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Your API key is stored only in your browser's localStorage and never
          sent anywhere except directly to Anthropic's API. Get your key at{" "}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            console.anthropic.com
          </a>
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{ ...inputStyle, fontSize: 14, padding: "10px 14px" }}
          />
        </div>
        <button
          onClick={() => {
            if (key.trim().startsWith("sk-")) {
              localStorage.setItem("anthropic_key", key.trim());
              onSave(key.trim());
            } else
              alert(
                "Please enter a valid Anthropic API key starting with sk-ant-"
              );
          }}
          style={{
            ...btnStyle("#0d2b1a", "#4ade80"),
            padding: "10px 24px",
            fontSize: 13,
            width: "100%",
          }}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

// ── AI Screening ──────────────────────────────────────────────────────────────
async function screenCV(candidateName, pdfBase64, jd, apiKey) {
  const prompt = `You are an expert HR recruiter screening a CV for the following internship role:

${jd}

The candidate's name is: ${candidateName}

Analyse the CV thoroughly and respond ONLY with a valid JSON object — no markdown, no explanation, no backticks. Use exactly this structure:
{
  "fileLabel": "",
  "degree": "full degree name, university and years",
  "year": "Year 1 or Year 2 or Penultimate or Final or Postgrad",
  "major": "their major or field of study",
  "note": "any important flag such as mislabeled file, or empty string",
  "verdict": "Strong Yes or Yes or Maybe or No",
  "verdictReason": "one concise sentence explaining the verdict",
  "scores": {
    "technical": <integer 1-10>,
    "analytics": <integer 1-10>,
    "experience": <integer 1-10>,
    "businessAcumen": <integer 1-10>,
    "communication": <integer 1-10>
  },
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "techStack": ["tool1", "tool2", "tool3"]
}

Scoring criteria (1-10):
- technical: depth of Python/R/SQL/coding skills
- analytics: data analytics, dashboards, Tableau/Power BI, Excel proficiency
- experience: relevance and quality of internships and work experience
- businessAcumen: strategy frameworks, market research, business thinking
- communication: CV clarity, leadership roles, presentation experience

Verdict guide:
- Strong Yes: Excellent fit — strong technical AND business skills, right degree level
- Yes: Good fit, strong in most areas with minor gaps
- Maybe: Partial fit — notable gaps or wrong degree level
- No: Poor fit — missing key requirements or too early in studies`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "API request failed");
  }

  const data = await res.json();
  const text = data.content.map((b) => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ value }) {
  const color = value >= 8 ? "#4ade80" : value >= 6 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          background: "#1a1a2e",
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(value / 10) * 100}%`,
            background: color,
            height: "100%",
            borderRadius: 4,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "#9ca3af",
          minWidth: 16,
          textAlign: "right",
          fontFamily: "'IBM Plex Mono',monospace",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Editable List ─────────────────────────────────────────────────────────────
function EditableList({ items, onChange, placeholder }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
          <input
            value={item}
            onChange={(e) => {
              const n = [...items];
              n[i] = e.target.value;
              onChange(n);
            }}
            style={inputStyle}
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            style={{
              background: "#1f0808",
              border: "1px solid #ef444430",
              color: "#f87171",
              borderRadius: 6,
              padding: "0 10px",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ×
          </button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          placeholder={placeholder}
          style={{ ...inputStyle, borderStyle: "dashed", color: "#4b5563" }}
        />
        <button
          onClick={() => {
            if (draft.trim()) {
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          style={{
            background: "#052e16",
            border: "1px solid #22c55e30",
            color: "#4ade80",
            borderRadius: 6,
            padding: "0 12px",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Add Candidate Form ────────────────────────────────────────────────────────
function AddCandidateForm({ onAdd, onCancel, jd, apiKey }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [screening, setScreening] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else setError("Please upload a PDF file.");
  };

  const handleScreen = async () => {
    if (!name.trim()) {
      setError("Candidate name is required.");
      return;
    }
    if (!file) {
      setError("Please upload a CV (PDF).");
      return;
    }
    setError("");
    setScreening(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Failed to read file"));
        r.readAsDataURL(file);
      });
      const result = await screenCV(name.trim(), base64, jd, apiKey);
      onAdd({
        ...result,
        id: uid(),
        name: name.trim(),
        fileLabel: result.fileLabel || "",
        strengths: result.strengths || [],
        gaps: result.gaps || [],
        techStack: result.techStack || [],
      });
    } catch (e) {
      setError("Screening failed: " + e.message);
    }
    setScreening(false);
  };

  return (
    <div
      style={{
        background: "#0a0a16",
        border: "1px solid #6366f1",
        borderRadius: 14,
        padding: 28,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#e0e7ff",
              fontFamily: "'Syne',sans-serif",
            }}
          >
            Screen New Candidate
          </div>
          <div style={{ fontSize: 12, color: "#4b5563", marginTop: 3 }}>
            Upload a CV and let AI screen it against the active JD
          </div>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#4b5563",
            fontSize: 22,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Candidate Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          style={{ ...inputStyle, fontSize: 14, padding: "10px 14px" }}
        />
      </div>

      {/* Upload */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>CV Document</label>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "32px 20px",
            borderRadius: 12,
            cursor: "pointer",
            border: `2px dashed ${
              file ? "#22c55e" : dragOver ? "#6366f1" : "#2a2a3e"
            }`,
            background: file ? "#052e1620" : dragOver ? "#6366f110" : "#080810",
            transition: "all 0.2s",
          }}
        >
          {file ? (
            <>
              <div style={{ fontSize: 36 }}>✅</div>
              <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>
                {file.name}
              </div>
              <div style={{ fontSize: 11, color: "#374151" }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36 }}>📄</div>
              <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                Drop CV here or click to browse
              </div>
              <div style={{ fontSize: 11, color: "#374151" }}>
                PDF files only
              </div>
            </>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#1f0808",
            border: "1px solid #ef444440",
            borderRadius: 8,
            fontSize: 12,
            color: "#fca5a5",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚠</span> {error}
        </div>
      )}

      {/* Screening status */}
      {screening && (
        <div
          style={{
            padding: "12px 16px",
            background: "#0d1829",
            border: "1px solid #3b82f640",
            borderRadius: 8,
            fontSize: 12,
            color: "#93c5fd",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: "spin 1s linear infinite",
              fontSize: 16,
            }}
          >
            ◌
          </span>
          Analysing CV against job description — this takes a few seconds…
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleScreen}
          disabled={screening}
          style={{
            flex: 1,
            padding: "11px 0",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 700,
            cursor: screening ? "not-allowed" : "pointer",
            border: "none",
            background: screening ? "#1a2a1a" : "#166534",
            color: screening ? "#374151" : "#4ade80",
            opacity: screening ? 0.6 : 1,
            transition: "all 0.2s",
            fontFamily: "'Syne',sans-serif",
            letterSpacing: 0.3,
          }}
        >
          {screening ? "Screening…" : "⚡ Screen CV"}
        </button>
        <button
          onClick={onCancel}
          disabled={screening}
          style={{
            padding: "11px 20px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid #22223b",
            background: "transparent",
            color: "#4b5563",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Candidate Card ────────────────────────────────────────────────────────────
function CandidateCard({ c, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c);
  const vc = VERDICT_STYLE[c.verdict];
  const score = avgScore(c.scores);
  const sf = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const ss = (k, v) =>
    setDraft((d) => ({
      ...d,
      scores: { ...d.scores, [k]: Math.max(1, Math.min(10, Number(v))) },
    }));

  return (
    <div
      style={{
        border: `1px solid ${open ? vc.border : "#1e1e30"}`,
        borderRadius: 12,
        marginBottom: 8,
        background: "#0b0b18",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: open ? `0 0 0 1px ${vc.border}20` : "none",
      }}
    >
      {/* ── Header Row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 18px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => !editing && setOpen((o) => !o)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            flexShrink: 0,
            background: vc.badge,
            border: `2px solid ${vc.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: vc.text,
            fontFamily: "'IBM Plex Mono',monospace",
          }}
        >
          {c.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#f1f5f9",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {c.name}
            </span>
            {c.fileLabel && (
              <span
                style={{
                  fontSize: 10,
                  color: "#4b5563",
                  background: "#13131f",
                  padding: "2px 8px",
                  borderRadius: 20,
                  border: "1px solid #22223b",
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                {c.fileLabel}
              </span>
            )}
            {c.note && (
              <span
                style={{
                  fontSize: 10,
                  color: "#fbbf24",
                  background: "#27180060",
                  padding: "2px 8px",
                  borderRadius: 20,
                  border: "1px solid #d9770640",
                }}
              >
                {c.note}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4b5563",
              marginTop: 3,
              fontFamily: "'IBM Plex Sans',sans-serif",
            }}
          >
            {c.degree} · <span style={{ color: "#6b7280" }}>{c.year}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 9,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              Score
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color:
                  score >= 7.5 ? "#4ade80" : score >= 6 ? "#fbbf24" : "#f87171",
                fontFamily: "'Syne',sans-serif",
                lineHeight: 1.1,
              }}
            >
              {score.toFixed(1)}
            </div>
          </div>
          <div
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              background: vc.badge,
              border: `1px solid ${vc.border}`,
              color: vc.text,
              fontFamily: "'IBM Plex Mono',monospace",
              whiteSpace: "nowrap",
            }}
          >
            {c.verdict}
          </div>
          <div
            style={{
              color: "#2d2d44",
              fontSize: 12,
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "none",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* ── Expanded ── */}
      {open && (
        <div
          style={{ borderTop: "1px solid #13131f", padding: "18px 18px 20px" }}
        >
          {!editing ? (
            <>
              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => {
                    setDraft(c);
                    setEditing(true);
                  }}
                  style={btnStyle("#0d1829", "#60a5fa")}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${c.name}?`)) onDelete(c.id);
                  }}
                  style={btnStyle("#1f0808", "#f87171")}
                >
                  🗑 Remove
                </button>
              </div>

              {/* Assessment */}
              <div
                style={{
                  padding: "12px 16px",
                  background: vc.bg,
                  border: `1px solid ${vc.border}25`,
                  borderRadius: 10,
                  fontSize: 13,
                  color: vc.text,
                  marginBottom: 18,
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    opacity: 0.6,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  Assessment ·{" "}
                </span>
                {c.verdictReason}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                {/* Scores */}
                <div>
                  <SectionLabel>Score Breakdown</SectionLabel>
                  {SCORE_KEYS.map((k) => (
                    <div key={k} style={{ marginBottom: 9 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            fontFamily: "'IBM Plex Sans',sans-serif",
                          }}
                        >
                          {SCORE_LABELS[k]}
                        </span>
                      </div>
                      <ScoreBar value={c.scores[k]} />
                    </div>
                  ))}
                </div>

                {/* Strengths & Gaps */}
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <SectionLabel>Strengths</SectionLabel>
                    {c.strengths.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            color: "#22c55e",
                            fontSize: 12,
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#d1fae5",
                            lineHeight: 1.5,
                          }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <SectionLabel>Gaps</SectionLabel>
                    {c.gaps.map((g, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            color: "#ef4444",
                            fontSize: 12,
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        >
                          ✗
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#fecaca",
                            lineHeight: 1.5,
                          }}
                        >
                          {g}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              {c.techStack?.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid #13131f",
                  }}
                >
                  <SectionLabel>Tech Stack</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.techStack.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          color: "#c4b5fd",
                          background: "#13101f",
                          border: "1px solid #2d1f4e",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontFamily: "'IBM Plex Mono',monospace",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── Edit Mode ── */
            <div onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {[
                  ["name", "Name"],
                  ["fileLabel", "File Label"],
                  ["degree", "Degree"],
                  ["year", "Year Level"],
                  ["major", "Major"],
                  ["note", "Note"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      value={draft[k] || ""}
                      onChange={(e) => sf(k, e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Verdict</label>
                <div style={{ display: "flex", gap: 7 }}>
                  {VERDICT_OPTIONS.map((v) => {
                    const vs = VERDICT_STYLE[v];
                    return (
                      <button
                        key={v}
                        onClick={() => sf("verdict", v)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          border: `1px solid ${
                            draft.verdict === v ? vs.border : "#22223b"
                          }`,
                          background:
                            draft.verdict === v ? vs.badge : "transparent",
                          color: draft.verdict === v ? vs.text : "#4b5563",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Assessment</label>
                <textarea
                  value={draft.verdictReason || ""}
                  onChange={(e) => sf("verdictReason", e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Scores (1–10)</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    gap: 8,
                  }}
                >
                  {SCORE_KEYS.map((k) => (
                    <div key={k}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#4b5563",
                          marginBottom: 4,
                          textAlign: "center",
                          fontFamily: "'IBM Plex Mono',monospace",
                        }}
                      >
                        {SCORE_LABELS[k].split(" ")[0]}
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={draft.scores[k]}
                        onChange={(e) => ss(k, e.target.value)}
                        style={{
                          ...inputStyle,
                          textAlign: "center",
                          padding: "8px 4px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label style={labelStyle}>Strengths</label>
                  <EditableList
                    items={draft.strengths || []}
                    onChange={(v) => sf("strengths", v)}
                    placeholder="Add strength…"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gaps</label>
                  <EditableList
                    items={draft.gaps || []}
                    onChange={(v) => sf("gaps", v)}
                    placeholder="Add gap…"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Tech Stack</label>
                <EditableList
                  items={draft.techStack || []}
                  onChange={(v) => sf("techStack", v)}
                  placeholder="Add tool…"
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    onUpdate(draft);
                    setEditing(false);
                  }}
                  style={{
                    ...btnStyle("#052e16", "#4ade80"),
                    padding: "8px 20px",
                  }}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={() => {
                    setDraft(c);
                    setEditing(false);
                  }}
                  style={{
                    ...btnStyle("transparent", "#4b5563"),
                    padding: "8px 16px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const btnStyle = (bg, color) => ({
  padding: "7px 16px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  border: `1px solid ${color}35`,
  background: bg,
  color,
  fontFamily: "'IBM Plex Sans',sans-serif",
  transition: "opacity 0.15s",
});
const labelStyle = {
  display: "block",
  fontSize: 11,
  color: "#6b7280",
  marginBottom: 5,
  letterSpacing: 0.4,
  fontFamily: "'IBM Plex Mono',monospace",
  textTransform: "uppercase",
};
const inputStyle = {
  background: "#080812",
  border: "1px solid #1e1e30",
  borderRadius: 8,
  padding: "7px 11px",
  color: "#e2e8f0",
  fontSize: 12,
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "'IBM Plex Sans',sans-serif",
  outline: "none",
};
const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 8,
      fontFamily: "'IBM Plex Mono',monospace",
      fontWeight: 500,
    }}
  >
    {children}
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [jd, setJd] = useState(DEFAULT_JD);
  const [filter, setFilter] = useState("All");
  const [showNew, setShowNew] = useState(false);
  const [showJdEdit, setShowJdEdit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("candidates");
  const [apiKey, setApiKey] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cv_screener_data");
      if (saved) {
        const p = JSON.parse(saved);
        setCandidates(p.candidates || DEFAULT_CANDIDATES);
        setJd(p.jd || DEFAULT_JD);
      } else setCandidates(DEFAULT_CANDIDATES);
      const key = localStorage.getItem("anthropic_key");
      if (key) setApiKey(key);
    } catch {
      setCandidates(DEFAULT_CANDIDATES);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((c, j) => {
    try {
      localStorage.setItem(
        "cv_screener_data",
        JSON.stringify({ candidates: c, jd: j })
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateCandidates = (c) => {
    setCandidates(c);
    save(c, jd);
  };
  const handleUpdate = (u) =>
    updateCandidates(candidates.map((c) => (c.id === u.id ? u : c)));
  const handleDelete = (id) =>
    updateCandidates(candidates.filter((c) => c.id !== id));
  const handleAdd = (c) => {
    const next = [...candidates, c];
    updateCandidates(next);
    setShowNew(false);
  };
  const updateJd = (j) => {
    setJd(j);
    save(candidates, j);
  };
  const handleReset = () => {
    if (window.confirm("Reset all data to defaults?")) {
      setCandidates(DEFAULT_CANDIDATES);
      setJd(DEFAULT_JD);
      save(DEFAULT_CANDIDATES, DEFAULT_JD);
    }
  };

  const filtered =
    filter === "All"
      ? candidates
      : candidates.filter((c) => c.verdict === filter);
  const counts = {
    All: candidates.length,
    ...Object.fromEntries(
      VERDICT_OPTIONS.map((v) => [
        v,
        candidates.filter((c) => c.verdict === v).length,
      ])
    ),
  };

  if (!loaded)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060610",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4b5563",
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 13,
        }}
      >
        Loading…
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060610",
        fontFamily: "'IBM Plex Sans',sans-serif",
      }}
    >
      <FontLink />

      {showApiModal && (
        <ApiKeyModal
          onSave={(k) => {
            setApiKey(k);
            setShowApiModal(false);
          }}
        />
      )}

      {/* ── Top Nav ── */}
      <div
        style={{
          background: "#0a0a16",
          borderBottom: "1px solid #13131f",
          padding: "0 28px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 58,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              ⚡
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  fontFamily: "'Syne',sans-serif",
                  lineHeight: 1,
                }}
              >
                CV Screener
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#374151",
                  fontFamily: "'IBM Plex Mono',monospace",
                  marginTop: 1,
                }}
              >
                Abdul Latif Jameel · MSCD
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                background: "#080812",
                borderRadius: 8,
                border: "1px solid #13131f",
                padding: 3,
                gap: 2,
              }}
            >
              {[
                ["candidates", "Candidates"],
                ["jd", "Job Description"],
              ].map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background: tab === t ? "#1e1e35" : "transparent",
                    color: tab === t ? "#e0e7ff" : "#4b5563",
                    fontFamily: "'IBM Plex Mono',monospace",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowApiModal(true)}
              title="API Key"
              style={{
                ...btnStyle("#13131f", "#6366f1"),
                padding: "6px 12px",
                fontSize: 11,
              }}
            >
              🔑 API Key
            </button>
            <button
              onClick={handleReset}
              style={{
                ...btnStyle("transparent", "#374151"),
                padding: "6px 12px",
                fontSize: 11,
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px" }}>
        {/* ── JD Tab ── */}
        {tab === "jd" && (
          <div
            style={{
              background: "#0a0a16",
              border: "1px solid #13131f",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #13131f",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#e0e7ff",
                    fontFamily: "'Syne',sans-serif",
                  }}
                >
                  Job Description
                </div>
                <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>
                  Used as the benchmark for all AI screening
                </div>
              </div>
              <button
                onClick={() => setShowJdEdit((o) => !o)}
                style={btnStyle("#13131f", "#818cf8")}
              >
                {showJdEdit ? "✓ Done" : "✏️ Edit JD"}
              </button>
            </div>
            <div style={{ padding: 20 }}>
              {showJdEdit ? (
                <textarea
                  value={jd}
                  onChange={(e) => updateJd(e.target.value)}
                  rows={20}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.8,
                    fontSize: 13,
                  }}
                />
              ) : (
                <pre
                  style={{
                    color: "#9ca3af",
                    fontSize: 13,
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    lineHeight: 1.8,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {jd}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* ── Candidates Tab ── */}
        {tab === "candidates" && (
          <>
            {/* Summary Bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {VERDICT_OPTIONS.map((v) => {
                const vc = VERDICT_STYLE[v];
                return (
                  <div
                    key={v}
                    onClick={() => setFilter(filter === v ? "All" : v)}
                    style={{
                      background: vc.bg,
                      border: `1px solid ${
                        filter === v ? vc.border : vc.border + "40"
                      }`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: vc.text,
                        fontFamily: "'Syne',sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {counts[v]}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: vc.text,
                        opacity: 0.65,
                        marginTop: 4,
                        fontFamily: "'IBM Plex Mono',monospace",
                      }}
                    >
                      {v}
                    </div>
                    {filter === v && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 3,
                          height: "100%",
                          background: vc.border,
                          borderRadius: "0 12px 12px 0",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", ...VERDICT_OPTIONS].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: `1px solid ${
                        filter === f ? "#6366f1" : "#13131f"
                      }`,
                      background: filter === f ? "#6366f1" : "transparent",
                      color: filter === f ? "#fff" : "#4b5563",
                      transition: "all 0.15s",
                      fontFamily: "'IBM Plex Mono',monospace",
                    }}
                  >
                    {f} <span style={{ opacity: 0.6 }}>({counts[f] ?? 0})</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!apiKey) {
                    setShowApiModal(true);
                  } else {
                    setShowNew(true);
                  }
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid #6366f1",
                  background: "#6366f115",
                  color: "#818cf8",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: 0.3,
                  transition: "all 0.15s",
                }}
              >
                + Add Candidate
              </button>
            </div>

            {/* Add Form */}
            {showNew && (
              <AddCandidateForm
                onAdd={handleAdd}
                onCancel={() => setShowNew(false)}
                jd={jd}
                apiKey={apiKey}
              />
            )}

            {/* API Key Notice */}
            {!apiKey && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#1a1200",
                  border: "1px solid #d9770640",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#fbbf24",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  ⚠ Set your Anthropic API key to enable AI-powered CV screening
                </span>
                <button
                  onClick={() => setShowApiModal(true)}
                  style={{
                    ...btnStyle("#271800", "#fbbf24"),
                    fontSize: 11,
                    padding: "5px 12px",
                  }}
                >
                  Set Key →
                </button>
              </div>
            )}

            {/* Candidate List */}
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#2d2d44",
                  padding: "60px 0",
                  fontSize: 13,
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                No candidates in this category
              </div>
            )}
            {filtered.map((c) => (
              <CandidateCard
                key={c.id}
                c={c}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}

            {/* Footer */}
            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "#0a0a16",
                border: "1px solid #0f0f1e",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#2d2d44",
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                {candidates.length} candidates · AI scoring via Claude API ·
                Saved to localStorage
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#2d2d44",
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                MSCD Intern Screening
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Robust plain-text CV parser.
 * Works on TXT exports from Word, LinkedIn, etc.
 * Returns a data object matching the app's resume data shape.
 */

const SECTION_PATTERNS = {
  experience:     /^(work\s+)?experience|employment(\s+history)?|career|positions?\s+held/i,
  education:      /^education|academic|qualifications?|degrees?/i,
  skills:         /^(technical\s+)?skills?|competenc(ies|y)|expertise|technologies|tools/i,
  summary:        /^(professional\s+)?(summary|profile|about|objective|overview|bio)/i,
  certifications: /^certifications?|licenses?|credentials?|accreditations?/i,
  languages:      /^languages?|linguistic/i,
};

function detectSection(line) {
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(line.trim())) return key;
  }
  return null;
}

function isContactLine(line) {
  return /[@+\d()\-.]/.test(line) && line.length < 80;
}

function extractEmail(text) {
  const m = text.match(/[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : "";
}

function extractPhone(text) {
  // Matches international and local formats
  const m = text.match(/(\+?\d[\d\s\-().]{6,}\d)/);
  return m ? m[0].trim() : "";
}

function extractWebsite(text) {
  const m = text.match(
    /(https?:\/\/[^\s,]+|(?:www\.|linkedin\.com\/in\/|github\.com\/)[^\s,]+)/i
  );
  return m ? m[0] : "";
}

function extractLocation(text) {
  // Looks for "City, State" or "City, Country" patterns
  const m = text.match(/\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})\b/);
  return m ? m[0] : "";
}

function extractPeriod(line) {
  // e.g. "Jan 2020 – Present", "2018-2021", "March 2015 to June 2018"
  const m = line.match(
    /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|\b\d{4}\s*[-–—]\s*(?:\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow)/
  );
  return m ? m[0].trim() : "";
}

function splitBullets(lines) {
  return lines
    .map((l) => l.replace(/^[•\-\*\u2022\u2023\u25E6\u2043]\s*/, "").trim())
    .filter((l) => l.length > 5 && l.length < 300);
}

export function parseCV(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const data = {
    name: "",
    title: "",
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    location: extractLocation(rawText),
    website: extractWebsite(rawText),
    summary: "",
    experience:     [],
    education:      [],
    skills:         [],
    certifications: [],
    languages:      [],
  };

  // ── Name: first non-contact, non-empty line ─────────────────────────
  for (const line of lines.slice(0, 5)) {
    if (!isContactLine(line) && line.length > 1 && line.length < 60) {
      data.name = line;
      break;
    }
  }

  // ── Title: line right after name that reads like a job title ────────
  const nameIdx = lines.indexOf(data.name);
  if (nameIdx !== -1) {
    for (let i = nameIdx + 1; i < Math.min(nameIdx + 5, lines.length); i++) {
      const l = lines[i];
      if (!isContactLine(l) && l.length > 2 && l.length < 80 && !detectSection(l)) {
        data.title = l;
        break;
      }
    }
  }

  // ── Walk through lines and assign to sections ───────────────────────
  let currentSection = null;
  let sectionBuffer  = [];

  const flushBuffer = () => {
    if (!currentSection || sectionBuffer.length === 0) return;
    processSection(currentSection, sectionBuffer, data);
    sectionBuffer = [];
  };

  for (const line of lines) {
    const detected = detectSection(line);
    if (detected) {
      flushBuffer();
      currentSection = detected;
      continue;
    }
    if (currentSection) {
      sectionBuffer.push(line);
    }
  }
  flushBuffer();

  // ── Fallback: if no sections found, try to grab a summary paragraph ─
  if (!data.summary) {
    const summaryCandidate = lines
      .filter((l) => l.length > 40 && !isContactLine(l) && !detectSection(l))
      .slice(0, 5);
    if (summaryCandidate.length) data.summary = summaryCandidate.join(" ").slice(0, 400);
  }

  // ── Ensure arrays are never empty ───────────────────────────────────
  if (!data.experience.length)
    data.experience = [{ id: Date.now(), company: "", role: "", period: "", bullets: [""] }];
  if (!data.education.length)
    data.education = [{ id: Date.now() + 1, school: "", degree: "", year: "", gpa: "" }];
  if (!data.skills.length)        data.skills         = [""];
  if (!data.certifications.length) data.certifications = [""];
  if (!data.languages.length)      data.languages      = [""];

  return data;
}

/* ── Section processors ───────────────────────────────────────────────── */

function processSection(section, lines, data) {
  switch (section) {
    case "summary":
      data.summary = lines.join(" ").replace(/\s+/g, " ").trim().slice(0, 500);
      break;

    case "skills": {
      // Handles: comma-separated, bullet lists, or one-per-line
      const raw = lines.join(" , ");
      const items = raw
        .split(/[,•\-\|·\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 50);
      data.skills = items.length ? items : [""];
      break;
    }

    case "certifications": {
      const items = splitBullets(lines).filter((l) => l.length > 3);
      data.certifications = items.length ? items : [""];
      break;
    }

    case "languages": {
      const raw = lines.join(" , ");
      const items = raw
        .split(/[,•\-\|·\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 60);
      data.languages = items.length ? items : [""];
      break;
    }

    case "experience":
      data.experience = parseExperienceBlock(lines);
      break;

    case "education":
      data.education = parseEducationBlock(lines);
      break;
  }
}

function parseExperienceBlock(lines) {
  const jobs = [];
  let current = null;

  for (const line of lines) {
    const period = extractPeriod(line);

    // A line with a date range likely starts or belongs to a job header
    if (period) {
      if (!current) {
        current = { id: Date.now() + jobs.length, company: "", role: "", period, bullets: [] };
      } else {
        current.period = period;
      }
      // Try to extract company/role from same line minus the date
      const withoutDate = line.replace(period, "").replace(/[-–|·,]+$/, "").trim();
      if (withoutDate.length > 2) {
        // Heuristic: if ALLCAPS or first word looks like company name
        if (/^[A-Z][A-Z\s&.]+$/.test(withoutDate)) {
          current.company = withoutDate;
        } else {
          current.role = withoutDate;
        }
      }
      continue;
    }

    // Lines that look like a job title (short, title-case, no bullets)
    if (
      current &&
      !line.startsWith("•") && !line.startsWith("-") &&
      line.length < 80 &&
      line.length > 3 &&
      current.bullets.length === 0 &&
      !current.role
    ) {
      current.role = line;
      continue;
    }

    // Lines that look like a company name (short, often ALL CAPS)
    if (
      current &&
      !line.startsWith("•") && !line.startsWith("-") &&
      line.length < 60 &&
      line.length > 2 &&
      current.bullets.length === 0 &&
      !current.company
    ) {
      current.company = line;
      continue;
    }

    // Bullet points / achievement lines
    if (current && line.length > 10) {
      const bullet = line.replace(/^[•\-\*]\s*/, "").trim();
      if (bullet.length > 5) {
        current.bullets.push(bullet);
      }
    }

    // Blank-ish lines between jobs → push current, start fresh
    if (!current) {
      current = { id: Date.now() + jobs.length, company: "", role: "", period: "", bullets: [] };
    }
  }

  if (current && (current.company || current.role)) {
    if (!current.bullets.length) current.bullets = [""];
    jobs.push(current);
  }

  return jobs.length
    ? jobs.map((j) => ({ ...j, bullets: j.bullets.length ? j.bullets : [""] }))
    : [{ id: Date.now(), company: "", role: "", period: "", bullets: [""] }];
}

function parseEducationBlock(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    // Year match → start or update entry
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      if (!current) current = { id: Date.now() + entries.length, school: "", degree: "", year: "", gpa: "" };
      current.year = yearMatch[0];

      // GPA in same line
      const gpaMatch = line.match(/GPA[:\s]+(\d\.\d+)/i);
      if (gpaMatch) current.gpa = gpaMatch[1];

      const withoutYear = line.replace(/\b(19|20)\d{2}\b/, "").replace(/[-–|,()]+/g, " ").trim();
      if (withoutYear.length > 2 && !current.degree) current.degree = withoutYear;
      continue;
    }

    if (!current) {
      current = { id: Date.now() + entries.length, school: "", degree: "", year: "", gpa: "" };
    }

    // Degree keywords
    if (/\b(bachelor|master|phd|doctorate|bs|ba|ms|ma|mba|bsc|msc|bfa|associate|diploma|certificate)\b/i.test(line)) {
      current.degree = line;
      continue;
    }

    // Anything else is likely school name
    if (!current.school && line.length > 3 && line.length < 100) {
      current.school = line;
    }
  }

  if (current && (current.school || current.degree)) entries.push(current);

  return entries.length
    ? entries
    : [{ id: Date.now(), school: "", degree: "", year: "", gpa: "" }];
}

/* ── File reader helper ───────────────────────────────────────────────── */

/**
 * Reads a File object.
 * - .txt / .rtf → plain text
 * - .doc / .docx → best-effort text extraction from raw binary
 * - .pdf → extracts embedded text via regex (works for text-layer PDFs)
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (file.name.endsWith(".pdf")) {
      reader.onload = (e) => {
        try {
          const binary = e.target.result;
          // Extract readable strings from PDF binary
          const strings = [];
          const regex = /\(([^()\\]{3,})\)/g;
          let m;
          while ((m = regex.exec(binary)) !== null) {
            const s = m[1].replace(/\\n/g, "\n").replace(/\\r/g, "").trim();
            if (s.length > 2) strings.push(s);
          }
          // Also try BT...ET text blocks
          const btRegex = /BT([\s\S]*?)ET/g;
          let btM;
          while ((btM = btRegex.exec(binary)) !== null) {
            const block = btM[1];
            const tjRegex = /\(([^)]{2,})\)\s*T[jJ]/g;
            let tjM;
            while ((tjM = tjRegex.exec(block)) !== null) {
              strings.push(tjM[1].trim());
            }
          }
          resolve(strings.join("\n"));
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      reader.onload = (e) => {
        try {
          const binary = e.target.result;
          // Extract readable text strings from docx XML
          const xmlMatch = binary.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
          const text = xmlMatch
            .map((t) => t.replace(/<[^>]+>/g, ""))
            .join(" ")
            .replace(/\s+/g, " ");

          // Fallback: grab any readable ASCII strings > 3 chars
          if (text.length < 50) {
            const strings = binary.match(/[a-zA-Z@.+\-\d\s,()]{4,}/g) || [];
            resolve(strings.join("\n"));
          } else {
            resolve(text);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      // Plain text (.txt, .rtf, etc.)
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    }
  });
}
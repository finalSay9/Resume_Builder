/**
 * CV Parser — robust plain-text extractor
 * Handles TXT, and best-effort DOC/DOCX/RTF via binary string scanning.
 * For PDF: we use PDF.js via CDN (loaded dynamically) to extract real text.
 */

// ─── Section heading detection ────────────────────────────────────────────────
const SECTION_PATTERNS = {
  experience:     /^(work\s+)?experience|employment(\s+history)?|career(\s+history)?|positions?\s+held|professional\s+background/i,
  education:      /^education|academic(\s+background)?|qualifications?|degrees?|schooling/i,
  skills:         /^(technical\s+)?skills?|competenc(ies|y)|expertise|technologies|tools(\s+&\s+tech)?|core\s+competencies/i,
  summary:        /^(professional\s+)?(summary|profile|about(\s+me)?|objective|overview|introduction|bio)/i,
  certifications: /^certifications?|licenses?|credentials?|accreditations?|courses?/i,
  languages:      /^languages?|linguistic|spoken\s+languages/i,
};

function detectSection(line) {
  const clean = line.trim().replace(/[:\-–—_*#]+$/, "").trim();
  if (clean.length < 3 || clean.length > 60) return null;
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(clean)) return key;
  }
  return null;
}

// ─── Field extractors ─────────────────────────────────────────────────────────
export function extractEmail(text) {
  const m = text.match(/[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : "";
}

export function extractPhone(text) {
  const m = text.match(/(\+?[\d][\d\s\-().]{6,15}[\d])/);
  return m ? m[0].replace(/\s+/g, " ").trim() : "";
}

export function extractWebsite(text) {
  const m = text.match(/(https?:\/\/[^\s,<>]+|(?:www\.|linkedin\.com\/in\/|github\.com\/)[^\s,<>]+)/i);
  return m ? m[0].replace(/[.,;)]+$/, "") : "";
}

export function extractLocation(text) {
  // "City, ST" or "City, Country" pattern
  const m = text.match(/\b([A-Z][a-zA-Z\s\-]{2,25},\s*(?:[A-Z]{2}|[A-Z][a-zA-Z\s]{2,20}))\b/);
  return m ? m[0] : "";
}

function extractPeriod(line) {
  const m = line.match(
    /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*[-–—to/]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow|[Oo]ngoing)/
  );
  return m ? m[0].trim() : "";
}

function isContactLine(line) {
  return /[@+\d()\-.]/.test(line) && line.length < 80;
}

// ─── Main parser ──────────────────────────────────────────────────────────────
export function parseCV(rawText) {
  // Normalise line endings and strip control chars except newlines
  const cleaned = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\x20-\x7E\n\u00C0-\u024F]/g, " ") // keep latin extended chars
    .replace(/[ \t]+/g, " ");

  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const data = {
    name: "",
    title: "",
    email: extractEmail(cleaned),
    phone: extractPhone(cleaned),
    location: extractLocation(cleaned),
    website: extractWebsite(cleaned),
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
  };

  // Name: first short non-contact line
  for (const line of lines.slice(0, 6)) {
    if (
      !isContactLine(line) &&
      !detectSection(line) &&
      line.length > 1 &&
      line.length < 65 &&
      !/^(http|www)/i.test(line)
    ) {
      data.name = line.replace(/,\s*$/, "");
      break;
    }
  }

  // Title: second short non-contact line after name
  const nameIdx = lines.findIndex((l) => l === data.name);
  if (nameIdx !== -1) {
    for (let i = nameIdx + 1; i < Math.min(nameIdx + 6, lines.length); i++) {
      const l = lines[i];
      if (
        !isContactLine(l) &&
        !detectSection(l) &&
        l.length > 2 &&
        l.length < 80 &&
        !/^(http|www)/i.test(l)
      ) {
        data.title = l;
        break;
      }
    }
  }

  // Walk sections
  let currentSection = null;
  let buffer = [];

  const flush = () => {
    if (currentSection && buffer.length > 0) {
      processSection(currentSection, [...buffer], data);
    }
    buffer = [];
  };

  for (const line of lines) {
    const sec = detectSection(line);
    if (sec) {
      flush();
      currentSection = sec;
      continue;
    }
    if (currentSection) buffer.push(line);
  }
  flush();

  // Fallback summary from first long paragraph if none found
  if (!data.summary) {
    const candidate = lines
      .filter((l) => l.length > 50 && !isContactLine(l) && !detectSection(l))
      .slice(0, 4);
    if (candidate.length) data.summary = candidate.join(" ").slice(0, 500);
  }

  // Ensure arrays never empty
  if (!data.experience.length)
    data.experience = [{ id: Date.now(), company: "", role: "", period: "", bullets: [""] }];
  if (!data.education.length)
    data.education = [{ id: Date.now() + 1, school: "", degree: "", year: "", gpa: "" }];
  if (!data.skills.length)         data.skills         = [""];
  if (!data.certifications.length) data.certifications = [""];
  if (!data.languages.length)      data.languages      = [""];

  return data;
}

// ─── Section processors ───────────────────────────────────────────────────────
function processSection(section, lines, data) {
  switch (section) {
    case "summary":
      data.summary = lines.join(" ").replace(/\s+/g, " ").trim().slice(0, 500);
      break;

    case "skills": {
      const raw = lines.join(" , ");
      const items = raw
        .split(/[,•·|\n\/]/)
        .map((s) => s.replace(/^[-\s*]+/, "").trim())
        .filter((s) => s.length > 1 && s.length < 50);
      data.skills = items.length ? [...new Set(items)] : [""];
      break;
    }

    case "certifications": {
      const items = lines
        .map((l) => l.replace(/^[•\-*\d.]+\s*/, "").trim())
        .filter((l) => l.length > 3 && l.length < 150);
      data.certifications = items.length ? items : [""];
      break;
    }

    case "languages": {
      const raw = lines.join(" , ");
      const items = raw
        .split(/[,•·|\n]/)
        .map((s) => s.replace(/^[-\s*]+/, "").trim())
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
  let cur = null;

  const pushCur = () => {
    if (cur && (cur.company || cur.role)) {
      if (!cur.bullets.length) cur.bullets = [""];
      jobs.push(cur);
    }
  };

  for (const line of lines) {
    const period = extractPeriod(line);

    if (period) {
      // New job entry when we hit a date line
      if (cur && (cur.company || cur.role)) pushCur();
      cur = { id: Date.now() + jobs.length + Math.random(), company: "", role: "", period, bullets: [] };
      const rest = line.replace(period, "").replace(/[-–|·,()]+/g, " ").trim();
      if (rest.length > 2) {
        if (/^[A-Z][A-Z\s&.,]+$/.test(rest)) cur.company = rest;
        else cur.role = rest;
      }
      continue;
    }

    if (!cur) {
      cur = { id: Date.now() + jobs.length + Math.random(), company: "", role: "", period: "", bullets: [] };
    }

    const isBullet = /^[•\-*]\s/.test(line) || (cur.role && cur.company && line.length > 20);

    if (isBullet || (cur.role && cur.company)) {
      const bullet = line.replace(/^[•\-*]\s*/, "").trim();
      if (bullet.length > 5 && bullet.length < 300) {
        cur.bullets.push(bullet);
      }
    } else if (!cur.role && line.length > 2 && line.length < 80) {
      cur.role = line;
    } else if (!cur.company && line.length > 2 && line.length < 60) {
      cur.company = line;
    }
  }

  pushCur();

  return jobs.length
    ? jobs
    : [{ id: Date.now(), company: "", role: "", period: "", bullets: [""] }];
}

function parseEducationBlock(lines) {
  const entries = [];
  let cur = null;

  for (const line of lines) {
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);

    if (yearMatch) {
      if (cur && (cur.school || cur.degree)) entries.push(cur);
      cur = { id: Date.now() + entries.length + Math.random(), school: "", degree: "", year: yearMatch[0], gpa: "" };
      const gpaMatch = line.match(/gpa[:\s]+(\d[\d.]+)/i);
      if (gpaMatch) cur.gpa = gpaMatch[1];
      const rest = line.replace(/\b(19|20)\d{2}\b/, "").replace(/[-–|,()gpa:\d.]+/gi, " ").trim();
      if (rest.length > 2 && !cur.degree) cur.degree = rest;
      continue;
    }

    if (!cur) {
      cur = { id: Date.now() + entries.length + Math.random(), school: "", degree: "", year: "", gpa: "" };
    }

    if (/\b(bachelor|master|phd|doctorate|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|mba|bsc|msc|bfa|mfa|associate|diploma|certificate|degree)\b/i.test(line)) {
      cur.degree = line;
    } else if (!cur.school && line.length > 3 && line.length < 100) {
      cur.school = line;
    }
  }

  if (cur && (cur.school || cur.degree)) entries.push(cur);

  return entries.length
    ? entries
    : [{ id: Date.now(), school: "", degree: "", year: "", gpa: "" }];
}

// ─── File reader ──────────────────────────────────────────────────────────────
/**
 * Reads a File and returns plain text.
 * PDF: uses PDF.js loaded from CDN for proper text extraction.
 * DOCX: unzips and reads word/document.xml
 * TXT/RTF: direct read
 */
export async function readFileAsText(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    return readPDF(file);
  }

  if (ext === "docx") {
    return readDOCX(file);
  }

  // TXT, RTF, DOC (legacy binary) — read as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || "");
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file, "UTF-8");
  });
}

// ── PDF via PDF.js CDN ────────────────────────────────────────────────────────
async function readPDF(file) {
  // Dynamically load PDF.js if not already present
  if (!window.pdfjsLib) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const texts = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ");
    texts.push(pageText);
  }

  return texts.join("\n");
}

// ── DOCX via JSZip ────────────────────────────────────────────────────────────
async function readDOCX(file) {
  // Dynamically load JSZip if not already present
  if (!window.JSZip) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  }

  const arrayBuffer = await file.arrayBuffer();
  const zip = await window.JSZip.loadAsync(arrayBuffer);
  const xmlFile = zip.file("word/document.xml");

  if (!xmlFile) throw new Error("Not a valid DOCX file");

  const xmlText = await xmlFile.async("string");

  // Extract text from <w:t> tags and insert newlines at paragraph breaks
  const paragraphs = xmlText.split(/<w:p[ >]/);
  const lines = paragraphs.map((para) => {
    const matches = para.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    return matches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ").trim();
  });

  return lines.filter((l) => l.length > 0).join("\n");
}

// ── Script loader helper ──────────────────────────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

// ─── Bridge: parse CV text → new data model shape ─────────────────────────────
import { EMPTY_EXPERIENCE, EMPTY_EDUCATION } from "./dataModel.js";

export function parseCVToModel(rawText) {
  const parsed = parseCV(rawText);

  return {
    fullName: parsed.name || "",
    email:    parsed.email || "",
    phone:    parsed.phone || "",
    location: parsed.location || "",
    website:  parsed.website || "",
    summary:  parsed.summary || "",

    experience: parsed.experience.map((e) => ({
      ...EMPTY_EXPERIENCE(),
      id:               e.id || Date.now() + Math.random(),
      jobTitle:         e.role    || "",
      company:          e.company || "",
      location:         "",
      startDate:        "",
      endDate:          "",
      currentlyWorking: /present|current|now/i.test(e.period || ""),
      description:      (e.bullets || []).filter(Boolean).join("\n"),
    })),

    education: parsed.education.map((e) => ({
      ...EMPTY_EDUCATION(),
      id:             e.id || Date.now() + Math.random(),
      school:         e.school || "",
      degree:         e.degree || "",
      fieldOfStudy:   "",
      country:        "",
      city:           "",
      startYear:      "",
      graduationYear: e.year || "",
    })),

    skills:      parsed.skills.filter(Boolean),
    skillInput:  "",
    summary:     parsed.summary || "",

    extras: [
      ...parsed.certifications.filter(Boolean).map((v) => ({
        id: Date.now() + Math.random(), type: "certification", value: v
      })),
      ...parsed.languages.filter(Boolean).map((v) => ({
        id: Date.now() + Math.random(), type: "language", value: v
      })),
    ],
  };
}
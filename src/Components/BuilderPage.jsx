import { useState, useRef } from "react";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_NAMES } from "../utils/Constants";
import { downloadResume } from "../utils/download";
import { generateWithAI } from "../utils/AiGeneration";
import {
  DEGREE_OPTIONS,
  EMPTY_EXPERIENCE,
  EMPTY_EDUCATION,
  EMPTY_EXTRA,
  SAMPLE_DATA,
} from "../utils/dataModel";

// ─── Shared tiny components ───────────────────────────────────────────────────

const Label = ({ children, required }) => (
  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const Field = ({ children }) => <div className="mb-4">{children}</div>;

const Inp = ({ value, onChange, placeholder, type = "text", className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
      placeholder:text-slate-300 transition-all ${className}`}
  />
);

const Sel = ({ value, onChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
      text-slate-700 transition-all ${className}`}
  >
    {children}
  </select>
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
      placeholder:text-slate-300 transition-all resize-none"
  />
);

const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 ${className}`}>
    {children}
  </div>
);

const AddBtn = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 border-2 border-dashed
      border-teal-200 hover:border-teal-400 text-teal-600 hover:text-teal-700
      py-3 rounded-xl transition-all text-sm font-semibold bg-teal-50/50 hover:bg-teal-50"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14"/>
    </svg>
    {label}
  </button>
);

const RemoveBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
    title="Remove"
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  </button>
);

// ─── Section nav tabs ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "personal",    label: "Personal",    icon: "👤" },
  { id: "experience",  label: "Experience",  icon: "💼" },
  { id: "education",   label: "Education",   icon: "🎓" },
  { id: "skills",      label: "Skills",      icon: "⚡" },
  { id: "summary",     label: "Summary",     icon: "📝" },
  { id: "extras",      label: "Extras",      icon: "✨" },
];

const EXTRA_TYPES = [
  { value: "certification",  label: "Certification"    },
  { value: "accomplishment", label: "Accomplishment"   },
  { value: "language",       label: "Language"         },
  { value: "hobby",          label: "Hobby & Interest" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function BuilderPage({ data, setData, template, setTemplate, onBack }) {
  const [activeSection,     setActiveSection]     = useState("personal");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [pdfLoading,        setPdfLoading]        = useState(false);
  const [aiLoading,         setAiLoading]         = useState("");
  const previewRef = useRef(null);

  // ── generic updater ────────────────────────────────────────────────────────
  const upd = (field, value) => setData((d) => ({ ...d, [field]: value }));

  // ── experience ─────────────────────────────────────────────────────────────
  const updExp = (id, field, value) =>
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));

  const addExp = () =>
    setData((d) => ({ ...d, experience: [...d.experience, EMPTY_EXPERIENCE()] }));

  const removeExp = (id) =>
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));

  // ── education ──────────────────────────────────────────────────────────────
  const updEdu = (id, field, value) =>
    setData((d) => ({
      ...d,
      education: d.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));

  const addEdu = () =>
    setData((d) => ({ ...d, education: [...d.education, EMPTY_EDUCATION()] }));

  const removeEdu = (id) =>
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));

  // ── skills ─────────────────────────────────────────────────────────────────
  const addSkill = (skill) => {
    const s = skill.trim();
    if (!s || data.skills.includes(s)) return;
    setData((d) => ({ ...d, skills: [...d.skills, s], skillInput: "" }));
  };

  const removeSkill = (skill) =>
    setData((d) => ({ ...d, skills: d.skills.filter((s) => s !== skill) }));

  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(data.skillInput);
    }
  };

  // ── extras ─────────────────────────────────────────────────────────────────
  const addExtra = (type) =>
    setData((d) => ({ ...d, extras: [...d.extras, { ...EMPTY_EXTRA(), type }] }));

  const updExtra = (id, field, value) =>
    setData((d) => ({
      ...d,
      extras: d.extras.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    }));

  const removeExtra = (id) =>
    setData((d) => ({ ...d, extras: d.extras.filter((x) => x.id !== id) }));

  // ── AI summary ─────────────────────────────────────────────────────────────
  const aiSummary = async () => {
    setAiLoading("summary");
    try {
      const role = data.experience[0]?.jobTitle || "professional";
      const prompt = `Write a compelling 3-sentence professional summary for a ${role}${
        data.fullName ? ` named ${data.fullName}` : ""
      }. Make it ATS-optimized, impactful, and in first-person implied style (no "I"). Return only the summary text.`;
      let result = "";
      await generateWithAI(prompt, (text) => {
        result = text;
        upd("summary", text);
      });
    } catch (e) {
      console.error(e);
    }
    setAiLoading("");
  };

  // ── AI experience description ───────────────────────────────────────────────
  const aiDescription = async (exp) => {
    setAiLoading(`desc-${exp.id}`);
    try {
      const prompt = `Write 3-4 powerful resume bullet points for a ${exp.jobTitle || "professional"} at ${
        exp.company || "a company"
      }. Each bullet should start with a strong action verb and be quantified where possible. Return only the bullet points, one per line, no numbering or dashes.`;
      await generateWithAI(prompt, (text) => {
        updExp(exp.id, "description", text);
      });
    } catch (e) {
      console.error(e);
    }
    setAiLoading("");
  };

  // ── PDF ────────────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      await downloadResume(previewRef.current, data.fullName || "Resume");
    } catch (e) {
      console.error(e);
      alert("PDF export failed. Please try again.");
    }
    setPdfLoading(false);
  };

  // ── Year options ───────────────────────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => String(currentYear - i));

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" />

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>R</div>
            <span className="font-bold text-slate-900 hidden sm:block">
              Resume<span style={{ color: "#0d9488" }}>Forge</span>
            </span>
          </div>
        </div>

        {/* Template switcher — desktop */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {TEMPLATE_NAMES.map((t) => (
            <button key={t} onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                template === t ? "bg-white shadow text-teal-600" : "text-slate-500 hover:text-slate-700"
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Template — mobile/tablet */}
          <select value={template} onChange={(e) => setTemplate(e.target.value)}
            className="lg:hidden text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
            {TEMPLATE_NAMES.map((t) => <option key={t}>{t}</option>)}
          </select>

          {/* Preview toggle — mobile */}
          <button onClick={() => setShowMobilePreview((p) => !p)}
            className="md:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
            {showMobilePreview
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/></svg> Edit</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> Preview</>
            }
          </button>

          {/* Download */}
          <button onClick={handleDownload} disabled={pdfLoading}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl text-white disabled:opacity-60 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
            {pdfLoading
              ? <><span className="animate-spin inline-block">⟳</span><span className="hidden sm:inline ml-1">Exporting…</span></>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><span className="hidden sm:inline ml-1">Download PDF</span></>
            }
          </button>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── FORM PANEL ──────────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "hidden" : "flex"} md:flex flex-col w-full md:w-[440px] lg:w-[500px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0`}>

          {/* Section tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-3 border-b border-slate-100 sticky top-0 bg-white z-10">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  activeSection === s.id
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
                style={activeSection === s.id ? { background: "linear-gradient(135deg,#0d9488,#0f766e)" } : {}}>
                <span className="text-base leading-none">{s.icon}</span>
                <span className="leading-tight">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="p-5 flex-1">

            {/* ══ PERSONAL ════════════════════════════════════════════ */}
            {activeSection === "personal" && (
              <div>
                <SectionHeader title="Personal Information" subtitle="Your basic contact details" />

                <Field>
                  <Label required>Full Name</Label>
                  <Inp value={data.fullName} onChange={(v) => upd("fullName", v)} placeholder="Alex Johnson" />
                </Field>

                <Field>
                  <Label required>Email Address</Label>
                  <Inp value={data.email} onChange={(v) => upd("email", v)} placeholder="alex@email.com" type="email" />
                </Field>

                <Field>
                  <Label>Phone Number</Label>
                  <Inp value={data.phone} onChange={(v) => upd("phone", v)} placeholder="+1 555 234 5678" type="tel" />
                </Field>

                <Field>
                  <Label>Location</Label>
                  <Inp value={data.location} onChange={(v) => upd("location", v)} placeholder="San Francisco, CA" />
                </Field>

                <button onClick={() => setData(SAMPLE_DATA)}
                  className="mt-2 w-full text-xs font-semibold border-2 border-dashed border-teal-200 text-teal-600 hover:border-teal-400 hover:bg-teal-50 py-2.5 rounded-xl transition-all">
                  Load Sample Data
                </button>
              </div>
            )}

            {/* ══ EXPERIENCE ══════════════════════════════════════════ */}
            {activeSection === "experience" && (
              <div>
                <SectionHeader title="Work Experience" subtitle="Add your jobs, most recent first" />

                {data.experience.map((exp, idx) => (
                  <SectionCard key={exp.id}>
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
                          {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                          {exp.jobTitle || "New Position"}
                        </span>
                      </div>
                      {data.experience.length > 1 && <RemoveBtn onClick={() => removeExp(exp.id)} />}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <Label required>Job Title</Label>
                        <Inp value={exp.jobTitle} onChange={(v) => updExp(exp.id, "jobTitle", v)} placeholder="Product Designer" />
                      </Field>
                      <Field>
                        <Label required>Company Name</Label>
                        <Inp value={exp.company} onChange={(v) => updExp(exp.id, "company", v)} placeholder="Stripe" />
                      </Field>
                    </div>

                    <Field>
                      <Label>Location (optional)</Label>
                      <Inp value={exp.location} onChange={(v) => updExp(exp.id, "location", v)} placeholder="San Francisco, CA" />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <Label>Start Date</Label>
                        <Inp value={exp.startDate} onChange={(v) => updExp(exp.id, "startDate", v)}
                          type="month" placeholder="YYYY-MM" />
                      </Field>
                      <Field>
                        <Label>End Date</Label>
                        <Inp value={exp.endDate} onChange={(v) => updExp(exp.id, "endDate", v)}
                          type="month" placeholder="YYYY-MM"
                          className={exp.currentlyWorking ? "opacity-40 pointer-events-none" : ""} />
                      </Field>
                    </div>

                    {/* Currently working checkbox */}
                    <label className="flex items-center gap-2.5 mb-4 cursor-pointer group">
                      <div
                        onClick={() => updExp(exp.id, "currentlyWorking", !exp.currentlyWorking)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          exp.currentlyWorking
                            ? "border-teal-500 bg-teal-500"
                            : "border-slate-300 group-hover:border-teal-400"
                        }`}>
                        {exp.currentlyWorking && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6 9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-slate-600 font-medium select-none"
                        onClick={() => updExp(exp.id, "currentlyWorking", !exp.currentlyWorking)}>
                        I currently work here
                      </span>
                    </label>

                    {/* Description */}
                    <Field>
                      <Label>Role Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(v) => updExp(exp.id, "description", v)}
                        placeholder={`Describe your responsibilities, achievements and impact...\n\nTip: Start each point with an action verb (Led, Built, Increased, Designed...)`}
                        rows={5}
                      />
                    </Field>

                    {/* AI bullet generator */}
                    <button
                      onClick={() => aiDescription(exp)}
                      disabled={!!aiLoading || !exp.jobTitle}
                      className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl border-2 border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-40 transition-all"
                    >
                      {aiLoading === `desc-${exp.id}`
                        ? <><span className="animate-spin">✦</span> Writing bullets…</>
                        : <><span>✦</span> Generate Description with AI</>
                      }
                    </button>
                  </SectionCard>
                ))}

                <AddBtn onClick={addExp} label="Add Another Position" />
              </div>
            )}

            {/* ══ EDUCATION ═══════════════════════════════════════════ */}
            {activeSection === "education" && (
              <div>
                <SectionHeader title="Education" subtitle="Your academic background" />

                {data.education.map((edu, idx) => (
                  <SectionCard key={edu.id}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
                          {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                          {edu.school || "New Education"}
                        </span>
                      </div>
                      {data.education.length > 1 && <RemoveBtn onClick={() => removeEdu(edu.id)} />}
                    </div>

                    <Field>
                      <Label required>School / University</Label>
                      <Inp value={edu.school} onChange={(v) => updEdu(edu.id, "school", v)} placeholder="Massachusetts Institute of Technology" />
                    </Field>

                    <Field>
                      <Label required>Degree</Label>
                      <Sel value={edu.degree} onChange={(v) => updEdu(edu.id, "degree", v)}>
                        <option value="">Select a degree…</option>
                        {DEGREE_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </Sel>
                    </Field>

                    <Field>
                      <Label>Field of Study</Label>
                      <Inp value={edu.fieldOfStudy} onChange={(v) => updEdu(edu.id, "fieldOfStudy", v)} placeholder="Computer Science" />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <Label>Country</Label>
                        <Inp value={edu.country} onChange={(v) => updEdu(edu.id, "country", v)} placeholder="United States" />
                      </Field>
                      <Field>
                        <Label>City</Label>
                        <Inp value={edu.city} onChange={(v) => updEdu(edu.id, "city", v)} placeholder="Cambridge, MA" />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field>
                        <Label>Start Year</Label>
                        <Sel value={edu.startYear} onChange={(v) => updEdu(edu.id, "startYear", v)}>
                          <option value="">Year…</option>
                          {years.map((y) => <option key={y}>{y}</option>)}
                        </Sel>
                      </Field>
                      <Field>
                        <Label>Graduation Year</Label>
                        <Sel value={edu.graduationYear} onChange={(v) => updEdu(edu.id, "graduationYear", v)}>
                          <option value="">Year…</option>
                          {years.map((y) => <option key={y}>{y}</option>)}
                        </Sel>
                      </Field>
                    </div>
                  </SectionCard>
                ))}

                <AddBtn onClick={addEdu} label="Add Another Education" />
              </div>
            )}

            {/* ══ SKILLS ══════════════════════════════════════════════ */}
            {activeSection === "skills" && (
              <div>
                <SectionHeader title="Skills" subtitle="Type a skill and press Enter or comma" />

                {/* Tag input */}
                <div className="border-2 border-slate-200 rounded-2xl p-3 min-h-[100px] flex flex-wrap gap-2 mb-3 focus-within:border-teal-400 transition-all bg-white">
                  {data.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-teal-400 hover:text-red-400 transition-colors leading-none">×</button>
                    </span>
                  ))}
                  <input
                    value={data.skillInput}
                    onChange={(e) => upd("skillInput", e.target.value)}
                    onKeyDown={handleSkillKey}
                    onBlur={() => data.skillInput.trim() && addSkill(data.skillInput)}
                    placeholder={data.skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
                    className="flex-1 min-w-[140px] outline-none text-sm text-slate-700 placeholder:text-slate-300 bg-transparent"
                  />
                </div>

                <p className="text-xs text-slate-400 mb-4">Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 text-[10px]">,</kbd> after each skill to add it</p>

                {/* Quick suggestions */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick add common skills</p>
                  <div className="flex flex-wrap gap-2">
                    {["Microsoft Office", "Google Workspace", "Project Management", "Leadership", "Communication",
                      "Python", "JavaScript", "React", "SQL", "Photoshop", "Figma", "AutoCAD",
                      "Customer Service", "Data Analysis", "Teamwork"].map((s) => (
                      <button key={s} onClick={() => addSkill(s)}
                        disabled={data.skills.includes(s)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ SUMMARY ══════════════════════════════════════════════ */}
            {activeSection === "summary" && (
              <div>
                <SectionHeader title="Professional Summary" subtitle="A 3–4 sentence overview of your career" />

                <Textarea
                  value={data.summary}
                  onChange={(v) => upd("summary", v)}
                  placeholder="Experienced professional with X years in [field]. Known for [key strength]. Passionate about [area of interest]. Seeking to [career goal]…"
                  rows={7}
                />
                <p className="text-xs text-slate-400 mt-2 mb-4">
                  {data.summary.length} characters · Aim for 300–600 characters
                </p>

                <button onClick={aiSummary} disabled={!!aiLoading}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-all text-sm"
                  style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
                  {aiLoading === "summary"
                    ? <><span className="animate-spin">✦</span> Writing your summary…</>
                    : <><span>✦</span> Generate Summary with AI</>
                  }
                </button>
              </div>
            )}

            {/* ══ EXTRAS ══════════════════════════════════════════════ */}
            {activeSection === "extras" && (
              <div>
                <SectionHeader title="Additional Information" subtitle="Certifications, languages, hobbies & more" />

                {EXTRA_TYPES.map(({ value: type, label }) => {
                  const items = data.extras.filter((x) => x.type === type);
                  const emoji = { certification: "🏆", accomplishment: "🌟", language: "🌍", hobby: "🎯" }[type];
                  return (
                    <div key={type} className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{emoji}</span>
                          <span className="text-sm font-bold text-slate-700">{label}s</span>
                          {items.length > 0 && (
                            <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                          )}
                        </div>
                        <button onClick={() => addExtra(type)}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-teal-50 transition-all border border-teal-200 hover:border-teal-300">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                          Add
                        </button>
                      </div>
                      {items.length === 0 && (
                        <p className="text-xs text-slate-300 italic py-2 pl-2">No {label.toLowerCase()}s added yet</p>
                      )}
                      {items.map((x) => (
                        <div key={x.id} className="flex gap-2 mb-2">
                          <input
                            value={x.value}
                            onChange={(e) => updExtra(x.id, "value", e.target.value)}
                            placeholder={{
                              certification: "e.g. AWS Certified Solutions Architect",
                              accomplishment: "e.g. Published research paper in Nature",
                              language: "e.g. Spanish (Conversational)",
                              hobby: "e.g. Marathon Running",
                            }[type]}
                            className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white
                              focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300"
                          />
                          <RemoveBtn onClick={() => removeExtra(x.id)} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile download */}
          <div className="md:hidden p-4 border-t border-slate-200 bg-white">
            <button onClick={handleDownload} disabled={pdfLoading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl disabled:opacity-60 text-sm"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
              {pdfLoading
                ? <><span className="animate-spin">⟳</span> Exporting PDF…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download PDF</>
              }
            </button>
          </div>
        </div>

        {/* ── PREVIEW PANEL ─────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "flex" : "hidden"} md:flex flex-1 bg-slate-200 overflow-y-auto items-start justify-center p-6`}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Live Preview · {template}
              </span>
              <button onClick={handleDownload} disabled={pdfLoading}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold disabled:opacity-60 transition-colors"
                style={{ color: "#0d9488" }}>
                {pdfLoading ? "Exporting…" : "↓ Download PDF"}
              </button>
            </div>

            {/* Preview */}
            <div ref={previewRef} className="bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ minHeight: "900px" }}>
              <ResumePreview data={data} template={template} />
            </div>

            {/* Mobile download inside preview */}
            <button onClick={handleDownload} disabled={pdfLoading}
              className="md:hidden mt-4 w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl disabled:opacity-60 text-sm"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
              {pdfLoading ? "Exporting…" : "Download PDF"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
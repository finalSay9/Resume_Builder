import { useState, useRef } from "react";
import Icon from "./Icon";
import Input from "./Input";
import TextArea from "./TextArea";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_NAMES } from "../utils/Constants";
import {
  aiEnhanceSummary,
  aiEnhanceBullets,
  aiEnhanceSkills,
} from "../utils/AiGeneration";



const SECTIONS = [
  { id: "personal",   label: "Personal"   },
  { id: "summary",    label: "Summary"    },
  { id: "experience", label: "Experience" },
  { id: "education",  label: "Education"  },
  { id: "skills",     label: "Skills"     },
  { id: "extras",     label: "Extras"     },
];

/* ─────────────────────────────────────────────────────────────────────────
   Cross-platform PDF / Print helper
   • Desktop : opens a print window (reliable, crisp)
   • Mobile  : builds a self-contained HTML blob and triggers download
               Falls back to opening a printable tab on iOS Safari
───────────────────────────────────────────────────────────────────────── */
function downloadResume(previewEl, name = "Resume") {
  if (!previewEl) return;

  const html = previewEl.innerHTML;
  // Gather all <style> tags from the current document so inline styles render
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${name} — Resume</title>
  <style>
    *,*::before,*::after{
      -webkit-print-color-adjust:exact!important;
      print-color-adjust:exact!important;
      color-adjust:exact!important;
      box-sizing:border-box;
      margin:0;padding:0;
    }
    body{font-size:12px;background:#fff;}
    @page{margin:0;}
    @media print{body{margin:0;}}
    ${styles}
  </style>
</head>
<body>${html}</body>
</html>`;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isMobile && !isSafari) {
    // Android Chrome / Firefox → Blob download
    try {
      const blob = new Blob([fullHTML], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${name.replace(/\s+/g, "_")}_Resume.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      return;
    } catch {
      // fall through to print window
    }
  }

  // Desktop + iOS Safari → print window
  const w = window.open("", "_blank");
  if (!w) {
    alert("Please allow pop-ups to download your resume.");
    return;
  }
  w.document.write(fullHTML);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    // Don't close on mobile — user needs to choose "Save as PDF"
    if (!isMobile) w.close();
  }, 600);
}

/* ─────────────────────────────────────────────────────────────────────── */

export default function BuilderPage({
  data, setData, template, setTemplate, onBack, sampleData,
}) {
  const [activeSection,      setActiveSection]      = useState("personal");
  const [aiLoading,          setAiLoading]          = useState("");
  const [showMobilePreview,  setShowMobilePreview]  = useState(false);
  const previewRef = useRef(null);

  /* ── data helpers ─────────────────────────────────────────────────── */
  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));

  const updateExp = (idx, field, value) =>
    setData((d) => {
      const exp = [...d.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...d, experience: exp };
    });

  const updateExpBullet = (idx, bi, value) =>
    setData((d) => {
      const exp = [...d.experience];
      const bullets = [...exp[idx].bullets];
      bullets[bi] = value;
      exp[idx] = { ...exp[idx], bullets };
      return { ...d, experience: exp };
    });

  const addExp = () =>
    setData((d) => ({
      ...d,
      experience: [...d.experience, { id: Date.now(), company: "", role: "", period: "", bullets: [""] }],
    }));

  const removeExp = (id) =>
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));

  const addExpBullet = (idx) =>
    setData((d) => {
      const exp = [...d.experience];
      exp[idx] = { ...exp[idx], bullets: [...exp[idx].bullets, ""] };
      return { ...d, experience: exp };
    });

  const removeExpBullet = (idx, bi) =>
    setData((d) => {
      const exp = [...d.experience];
      exp[idx] = { ...exp[idx], bullets: exp[idx].bullets.filter((_, i) => i !== bi) };
      return { ...d, experience: exp };
    });

  const updateEdu = (idx, field, value) =>
    setData((d) => {
      const edu = [...d.education];
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...d, education: edu };
    });

  const addEdu = () =>
    setData((d) => ({
      ...d,
      education: [...d.education, { id: Date.now(), school: "", degree: "", year: "", gpa: "" }],
    }));

  const removeEdu = (id) =>
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));

  const updateListItem = (field, idx, value) =>
    setData((d) => { const arr = [...d[field]]; arr[idx] = value; return { ...d, [field]: arr }; });

  const addListItem    = (field) =>
    setData((d) => ({ ...d, [field]: [...d[field], ""] }));

  const removeListItem = (field, idx) =>
    setData((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));

  /* ── AI helpers ───────────────────────────────────────────────────── */
  const handleAISummary    = ()    => aiEnhanceSummary({ data, setData, setAiLoading });
  const handleAIBullets    = (idx) => aiEnhanceBullets({ data, setData, setAiLoading, index: idx });
  const handleAISkills     = ()    => aiEnhanceSkills({ data, setData, setAiLoading });

  /* ── download ─────────────────────────────────────────────────────── */
  const handleDownload = () => downloadResume(previewRef.current, data.name || "My");

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <Icon name="back" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>R</div>
            <span className="font-bold text-slate-900 hidden sm:block text-sm">
              Resume<span style={{ color: "#0d9488" }}>Forge</span>
            </span>
          </div>
        </div>

        {/* Template switcher — desktop */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {TEMPLATE_NAMES.map((t) => (
            <button key={t} onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                template === t ? "bg-white shadow text-teal-600" : "text-slate-500 hover:text-slate-800"
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Template select — mobile */}
          <select value={template} onChange={(e) => setTemplate(e.target.value)}
            className="md:hidden text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
            {TEMPLATE_NAMES.map((t) => <option key={t}>{t}</option>)}
          </select>

          {/* Mobile preview toggle */}
          <button onClick={() => setShowMobilePreview((p) => !p)}
            className="md:hidden flex items-center gap-1 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
            <Icon name={showMobilePreview ? "edit" : "eye"} size={13} />
            {showMobilePreview ? "Edit" : "Preview"}
          </button>

          {/* Desktop download */}
          <button onClick={handleDownload}
            className="hidden md:flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
            <Icon name="download" size={15} /> Download PDF
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Form Panel ──────────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "hidden" : "flex"} md:flex flex-col w-full md:w-[420px] lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0`}>

          {/* Section nav */}
          <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto sticky top-0 bg-white z-10">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                style={activeSection === s.id ? { background: "linear-gradient(135deg,#0d9488,#0f766e)" } : {}}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-5 flex-1">

            {/* PERSONAL */}
            {activeSection === "personal" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Personal Information</h2>
                <Input label="Full Name"         value={data.name}     onChange={(v) => update("name", v)}     placeholder="Alex Johnson" />
                <Input label="Job Title"         value={data.title}    onChange={(v) => update("title", v)}    placeholder="Senior Product Designer" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Email" value={data.email} onChange={(v) => update("email", v)} placeholder="alex@email.com" />
                  <Input label="Phone" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+1 555 234 5678" />
                </div>
                <Input label="Location"           value={data.location} onChange={(v) => update("location", v)} placeholder="San Francisco, CA" />
                <Input label="Website / LinkedIn" value={data.website}  onChange={(v) => update("website", v)}  placeholder="linkedin.com/in/yourname" />
                <button onClick={() => setData(sampleData)}
                  className="mt-2 w-full text-xs font-semibold border border-dashed py-2 rounded-lg transition-colors"
                  style={{ color: "#0d9488", borderColor: "#99f6e4" }}>
                  Load Sample Data
                </button>
              </div>
            )}

            {/* SUMMARY */}
            {activeSection === "summary" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Professional Summary</h2>
                <TextArea label="Summary" value={data.summary} onChange={(v) => update("summary", v)}
                  placeholder="Write a compelling 2-3 sentence summary highlighting your expertise and value..."
                  rows={5} />
                <AIButton loading={aiLoading === "summary"} onClick={handleAISummary}
                  label="Generate with AI" loadingLabel="AI is writing..." />
              </div>
            )}

            {/* EXPERIENCE */}
            {activeSection === "experience" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Work Experience</h2>
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Position {idx + 1}</span>
                      {data.experience.length > 1 && (
                        <button onClick={() => removeExp(exp.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Job Title" value={exp.role}    onChange={(v) => updateExp(idx, "role", v)}    placeholder="Senior Designer" />
                      <Input label="Company"   value={exp.company} onChange={(v) => updateExp(idx, "company", v)} placeholder="Stripe" />
                    </div>
                    <Input label="Period" value={exp.period} onChange={(v) => updateExp(idx, "period", v)} placeholder="2021 – Present" />

                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Bullet Points</label>
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input value={b} onChange={(e) => updateExpBullet(idx, bi, e.target.value)}
                          placeholder={`Achievement ${bi + 1}...`}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
                        {exp.bullets.length > 1 && (
                          <button onClick={() => removeExpBullet(idx, bi)} className="text-red-400 hover:text-red-600">
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => addExpBullet(idx)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-teal-600 border border-dashed border-slate-300 hover:border-teal-300 py-1.5 rounded-lg transition-all">
                        <Icon name="plus" size={12} /> Add bullet
                      </button>
                      <button onClick={() => handleAIBullets(idx)} disabled={!!aiLoading || !exp.role}
                        className="flex-1 flex items-center justify-center gap-1 text-xs border py-1.5 rounded-lg transition-all disabled:opacity-50"
                        style={{ background: "#f0fdfa", color: "#0d9488", borderColor: "#99f6e4" }}>
                        {aiLoading === "bullets" ? <span className="animate-spin text-xs">✦</span> : <Icon name="sparkle" size={12} />}
                        AI Bullets
                      </button>
                    </div>
                  </div>
                ))}
                <AddButton onClick={addExp} label="Add Position" />
              </div>
            )}

            {/* EDUCATION */}
            {activeSection === "education" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Education</h2>
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Degree {idx + 1}</span>
                      {data.education.length > 1 && (
                        <button onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-600">
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </div>
                    <Input label="School / University" value={edu.school} onChange={(v) => updateEdu(idx, "school", v)} placeholder="MIT" />
                    <Input label="Degree & Field"      value={edu.degree} onChange={(v) => updateEdu(idx, "degree", v)} placeholder="BS Computer Science" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Graduation Year" value={edu.year} onChange={(v) => updateEdu(idx, "year", v)} placeholder="2020" />
                      <Input label="GPA (optional)"  value={edu.gpa}  onChange={(v) => updateEdu(idx, "gpa",  v)} placeholder="3.9" />
                    </div>
                  </div>
                ))}
                <AddButton onClick={addEdu} label="Add Education" />
              </div>
            )}

            {/* SKILLS */}
            {activeSection === "skills" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 border px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "#f0fdfa", borderColor: "#99f6e4", color: "#0f766e" }}>
                      <input value={skill} onChange={(e) => updateListItem("skills", i, e.target.value)}
                        className="bg-transparent outline-none w-20 min-w-0" style={{ color: "#0f766e" }}
                        placeholder="Skill..." />
                      <button onClick={() => removeListItem("skills", i)}
                        className="hover:text-red-500 ml-1 text-base leading-none" style={{ color: "#5eead4" }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("skills")}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-teal-50 text-slate-500 hover:text-teal-600 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-slate-300 hover:border-teal-300 transition-all">
                    <Icon name="plus" size={11} /> Add skill
                  </button>
                </div>
                <AIButton loading={aiLoading === "skills"} onClick={handleAISkills}
                  label="Suggest Skills with AI" loadingLabel="Generating skills..." />
              </div>
            )}

            {/* EXTRAS */}
            {activeSection === "extras" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Additional Sections</h2>
                {/* Certifications */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Certifications</label>
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={cert} onChange={(e) => updateListItem("certifications", i, e.target.value)}
                        placeholder="Google UX Design Certificate"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      {data.certifications.length > 1 && (
                        <button onClick={() => removeListItem("certifications", i)} className="text-red-400 hover:text-red-600">
                          <Icon name="trash" size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addListItem("certifications")}
                    className="flex items-center gap-1 text-xs mt-1 font-medium" style={{ color: "#0d9488" }}>
                    <Icon name="plus" size={12} /> Add certification
                  </button>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Languages</label>
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={lang} onChange={(e) => updateListItem("languages", i, e.target.value)}
                        placeholder="English (Native)"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400" />
                      {data.languages.length > 1 && (
                        <button onClick={() => removeListItem("languages", i)} className="text-red-400 hover:text-red-600">
                          <Icon name="trash" size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addListItem("languages")}
                    className="flex items-center gap-1 text-xs mt-1 font-medium" style={{ color: "#0d9488" }}>
                    <Icon name="plus" size={12} /> Add language
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Mobile Download Button ─────────────────────────────── */}
          <div className="md:hidden p-4 border-t border-slate-200 bg-white">
            <button onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", boxShadow: "0 4px 16px rgba(13,148,136,0.35)" }}>
              <Icon name="download" size={16} />
              Download Resume (PDF)
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Opens print dialog → tap "Save as PDF"
            </p>
          </div>
        </div>

        {/* ── Preview Panel ────────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "flex" : "hidden"} md:flex flex-1 bg-slate-200 overflow-y-auto items-start justify-center p-6`}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Live Preview · {template} Template
              </span>
              <button onClick={handleDownload}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: "#0d9488" }}>
                <Icon name="download" size={12} /> Save as PDF
              </button>
            </div>
            <div ref={previewRef} className="bg-white shadow-2xl rounded-xl overflow-hidden"
              style={{ minHeight: "800px" }}>
              <ResumePreview data={data} template={template} />
            </div>
            {/* Mobile download button inside preview pane too */}
            <button onClick={handleDownload}
              className="md:hidden mt-4 w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
              <Icon name="download" size={16} /> Download Resume
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Reusable sub-components ──────────────────────────────────────────── */
function AIButton({ loading, onClick, label, loadingLabel }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 text-sm"
      style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
      {loading ? <span className="animate-spin">✦</span> : <Icon name="sparkle" size={15} />}
      {loading ? loadingLabel : label}
    </button>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-teal-400 text-slate-500 hover:text-teal-600 py-3 rounded-xl transition-all text-sm font-semibold">
      <Icon name="plus" size={15} /> {label}
    </button>
  );
}
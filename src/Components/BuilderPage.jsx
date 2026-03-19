import { useState, useRef } from "react";
import Icon from "./Icon";
import Input from "./Input";
import TextArea from "./TextArea";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_NAMES } from "../utils/Constants";
import { downloadResume } from "../utils/download";
import {
  aiEnhanceSummary,
  aiEnhanceBullets,
  aiEnhanceSkills,
} from "../utils/AiGeneration";

const SECTIONS = [
  { id: "personal",    label: "Personal"   },
  { id: "summary",     label: "Summary"    },
  { id: "experience",  label: "Experience" },
  { id: "education",   label: "Education"  },
  { id: "skills",      label: "Skills"     },
  { id: "extras",      label: "Extras"     },
];

export default function BuilderPage({
  data,
  setData,
  template,
  setTemplate,
  onBack,
  sampleData,
}) {
  const [activeSection, setActiveSection]     = useState("personal");
  const [aiLoading, setAiLoading]             = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const previewRef = useRef(null);

  /* ── helpers ─────────────────────────────────────────────────────────── */
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
    setData((d) => {
      const arr = [...d[field]];
      arr[idx] = value;
      return { ...d, [field]: arr };
    });

  const addListItem = (field) =>
    setData((d) => ({ ...d, [field]: [...d[field], ""] }));

  const removeListItem = (field, idx) =>
    setData((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));

  /* ── PDF download ────────────────────────────────────────────────────── */
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadPDF = async () => {
    const node = previewRef.current;
    if (!node) return;
    setPdfLoading(true);
    try {
      // Dynamically load libraries so they don't bloat the initial bundle
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Capture at 2× scale for crisp output
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        // Force background-color printing
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style");
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      const imgData  = canvas.toDataURL("image/jpeg", 1.0);
      const pdf      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW    = pdf.internal.pageSize.getWidth();
      const pageH    = pdf.internal.pageSize.getHeight();
      const imgW     = pageW;
      const imgH     = (canvas.height * pageW) / canvas.width;

      // If content is taller than one page, split across pages
      if (imgH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
      } else {
        let yOffset = 0;
        while (yOffset < imgH) {
          pdf.addImage(imgData, "JPEG", 0, -yOffset, imgW, imgH);
          yOffset += pageH;
          if (yOffset < imgH) pdf.addPage();
        }
      }

      pdf.save(`${data.name ? data.name.replace(/\s+/g, "_") : "Resume"}_Resume.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF export failed. Please try again.");
    }
    setPdfLoading(false);
  };

  /* ── AI shorthands ───────────────────────────────────────────────────── */
  const handleAISummary = () => aiEnhanceSummary({ data, setData, setAiLoading });
  const handleAIBullets = (idx) => aiEnhanceBullets({ data, setData, setAiLoading, index: idx });
  const handleAISkills  = () => aiEnhanceSkills({ data, setData, setAiLoading });

  /* ── render ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Left: back + logo */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <Icon name="back" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-white text-xs">R</div>
            <span className="font-bold text-slate-900 hidden sm:block text-sm">ResumeForge</span>
          </div>
        </div>

        {/* Centre: template switcher (desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {TEMPLATE_NAMES.map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                template === t ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Right: mobile select + actions */}
        <div className="flex items-center gap-2">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="md:hidden text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {TEMPLATE_NAMES.map((t) => <option key={t}>{t}</option>)}
          </select>

          <button
            onClick={() => setShowMobilePreview((p) => !p)}
            className="md:hidden flex items-center gap-1 bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            <Icon name={showMobilePreview ? "edit" : "eye"} size={13} />
            {showMobilePreview ? "Edit" : "Preview"}
          </button>

          <button
            onClick={downloadPDF}
            disabled={pdfLoading}
            className="hidden md:flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            {pdfLoading ? <><span className="animate-spin inline-block mr-1">⟳</span>Exporting…</> : <><Icon name="download" size={15} /><span className="ml-1">Download PDF</span></>}
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Form Panel ─────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "hidden" : "flex"} md:flex flex-col w-full md:w-[420px] lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0`}>

          {/* Section Nav */}
          <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto sticky top-0 bg-white z-10">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-5 flex-1">

            {/* ── Personal ────────────────────────────────────────────── */}
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
                <button
                  onClick={() => setData(sampleData)}
                  className="mt-2 w-full text-xs text-indigo-500 hover:text-indigo-700 font-semibold border border-dashed border-indigo-300 py-2 rounded-lg transition-colors"
                >
                  Load Sample Data
                </button>
              </div>
            )}

            {/* ── Summary ─────────────────────────────────────────────── */}
            {activeSection === "summary" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Professional Summary</h2>
                <TextArea
                  label="Summary"
                  value={data.summary}
                  onChange={(v) => update("summary", v)}
                  placeholder="Write a compelling 2-3 sentence summary highlighting your expertise and value..."
                  rows={5}
                />
                <AIButton loading={aiLoading === "summary"} onClick={handleAISummary} label="Generate with AI" loadingLabel="AI is writing..." />
              </div>
            )}

            {/* ── Experience ──────────────────────────────────────────── */}
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
                      <Input label="Job Title" value={exp.role}    onChange={(v) => updateExp(idx, "role",    v)} placeholder="Senior Designer" />
                      <Input label="Company"   value={exp.company} onChange={(v) => updateExp(idx, "company", v)} placeholder="Stripe" />
                    </div>
                    <Input label="Period" value={exp.period} onChange={(v) => updateExp(idx, "period", v)} placeholder="2021 – Present" />

                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Bullet Points</label>
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input
                          value={b}
                          onChange={(e) => updateExpBullet(idx, bi, e.target.value)}
                          placeholder={`Achievement ${bi + 1}...`}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        />
                        {exp.bullets.length > 1 && (
                          <button onClick={() => removeExpBullet(idx, bi)} className="text-red-400 hover:text-red-600">
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => addExpBullet(idx)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-indigo-600 border border-dashed border-slate-300 hover:border-indigo-300 py-1.5 rounded-lg transition-all"
                      >
                        <Icon name="plus" size={12} /> Add bullet
                      </button>
                      <button
                        onClick={() => handleAIBullets(idx)}
                        disabled={!!aiLoading || !exp.role}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        {aiLoading === "bullets" ? <span className="animate-spin text-xs">✦</span> : <Icon name="sparkle" size={12} />}
                        AI Bullets
                      </button>
                    </div>
                  </div>
                ))}
                <AddButton onClick={addExp} label="Add Position" />
              </div>
            )}

            {/* ── Education ───────────────────────────────────────────── */}
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

            {/* ── Skills ──────────────────────────────────────────────── */}
            {activeSection === "skills" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <input
                        value={skill}
                        onChange={(e) => updateListItem("skills", i, e.target.value)}
                        className="bg-transparent outline-none w-20 min-w-0 text-indigo-700 placeholder:text-indigo-300"
                        placeholder="Skill..."
                      />
                      <button onClick={() => removeListItem("skills", i)} className="text-indigo-400 hover:text-red-500 ml-1 text-base leading-none">×</button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem("skills")}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-slate-300 hover:border-indigo-300 transition-all"
                  >
                    <Icon name="plus" size={11} /> Add skill
                  </button>
                </div>
                <AIButton loading={aiLoading === "skills"} onClick={handleAISkills} label="Suggest Skills with AI" loadingLabel="Generating skills..." />
              </div>
            )}

            {/* ── Extras ──────────────────────────────────────────────── */}
            {activeSection === "extras" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Additional Sections</h2>

                {/* Certifications */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Certifications</label>
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        value={cert}
                        onChange={(e) => updateListItem("certifications", i, e.target.value)}
                        placeholder="Google UX Design Certificate"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {data.certifications.length > 1 && (
                        <button onClick={() => removeListItem("certifications", i)} className="text-red-400 hover:text-red-600">
                          <Icon name="trash" size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addListItem("certifications")} className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1">
                    <Icon name="plus" size={12} /> Add certification
                  </button>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Languages</label>
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        value={lang}
                        onChange={(e) => updateListItem("languages", i, e.target.value)}
                        placeholder="English (Native)"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      {data.languages.length > 1 && (
                        <button onClick={() => removeListItem("languages", i)} className="text-red-400 hover:text-red-600">
                          <Icon name="trash" size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addListItem("languages")} className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1">
                    <Icon name="plus" size={12} /> Add language
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Download Button */}
          <div className="md:hidden p-4 border-t border-slate-200">
            <button onClick={downloadPDF} disabled={pdfLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl">
              {pdfLoading ? <><span className="animate-spin">⟳</span> Exporting…</> : <><Icon name="download" size={16} /> Download PDF</>}
            </button>
          </div>
        </div>

        {/* ── Right: Preview Panel ──────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "flex" : "hidden"} md:flex flex-1 bg-slate-200 overflow-y-auto items-start justify-center p-6`}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Live Preview · {template} Template
              </span>
              <button onClick={downloadPDF} disabled={pdfLoading} className="hidden md:flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-60">
                {pdfLoading ? <span className="animate-spin">⟳</span> : <Icon name="download" size={12} />}
                {pdfLoading ? " Exporting…" : " Download PDF"}
              </button>
            </div>
            <div ref={previewRef} className="resume-preview-root bg-white shadow-2xl rounded-xl overflow-hidden" style={{ minHeight: "800px", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
              <ResumePreview data={data} template={template} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Small reusable sub-components ──────────────────────────────────────── */
function AIButton({ loading, onClick, label, loadingLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 text-sm"
    >
      {loading ? <span className="animate-spin">✦</span> : <Icon name="sparkle" size={15} />}
      {loading ? loadingLabel : label}
    </button>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 py-3 rounded-xl transition-all text-sm font-semibold"
    >
      <Icon name="plus" size={15} /> {label}
    </button>
  );
}
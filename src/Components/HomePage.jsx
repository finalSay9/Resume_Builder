import { useRef } from "react";
import Icon from "./Icon";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_THEMES, TEMPLATE_NAMES } from "../utils/Constants";
import { SAMPLE_DATA } from "../App";

/* ── tiny helpers ────────────────────────────────────────────────────────── */
function parseUploadedCV(text) {
  // Best-effort plain-text CV parser → fills as many fields as possible
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const data = {
    name: "", title: "", email: "", phone: "", location: "", website: "",
    summary: "",
    experience: [{ id: Date.now(), company: "", role: "", period: "", bullets: [""] }],
    education:  [{ id: Date.now() + 1, school: "", degree: "", year: "", gpa: "" }],
    skills: [""],
    certifications: [""],
    languages: [""],
  };

  // Email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  if (emailMatch) data.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  if (phoneMatch) data.phone = phoneMatch[0].trim();

  // Website / LinkedIn
  const urlMatch = text.match(/(https?:\/\/[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+)/i);
  if (urlMatch) data.website = urlMatch[0];

  // Name – typically first non-empty line before email/phone
  if (lines.length > 0) data.name = lines[0];

  // Title – second line if it doesn't look like contact info
  if (lines[1] && !/[@+\d]/.test(lines[1])) data.title = lines[1];

  // Summary – look for a block after "summary" / "profile" / "about" keyword
  const summaryIdx = lines.findIndex((l) =>
    /^(summary|profile|about|objective)/i.test(l)
  );
  if (summaryIdx !== -1 && lines[summaryIdx + 1]) {
    data.summary = lines.slice(summaryIdx + 1, summaryIdx + 4).join(" ");
  }

  // Skills – look for comma/bullet separated items after "skills" heading
  const skillsIdx = lines.findIndex((l) => /^skills?/i.test(l));
  if (skillsIdx !== -1) {
    const skillLine = lines.slice(skillsIdx + 1, skillsIdx + 5).join(" ");
    const parsed = skillLine.split(/[,•·|]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
    if (parsed.length) data.skills = parsed;
  }

  return data;
}

/* ── component ───────────────────────────────────────────────────────────── */
export default function HomePage({ onStart, onSample, onUpload, setTemplate }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const parsed = parseUploadedCV(text);
      onUpload(parsed);
    };
    reader.readAsText(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div
      className="min-h-screen bg-white text-slate-900 overflow-x-hidden"
      style={{ fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif" }}
    >
      {/* Google Font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap"
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.doc,.docx,.pdf,.rtf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-slate-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
            R
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Resume<span style={{ color: "#0d9488" }}>Forge</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#how"       className="hover:text-teal-600 transition-colors">How it works</a>
          <a href="#templates" className="hover:text-teal-600 transition-colors">Templates</a>
          <a href="#features"  className="hover:text-teal-600 transition-colors">Features</a>
        </div>

        <button
          onClick={onStart}
          className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 shadow-md"
          style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}
        >
          Build Resume →
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 pt-20 pb-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #0d9488 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #0d9488 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#0d9488 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 border"
                style={{ color: "#0d9488", background: "#f0fdfa", borderColor: "#99f6e4" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                AI-Powered · Free to use
              </div>

              <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                className="text-5xl lg:text-6xl font-normal leading-[1.1] mb-6 text-slate-900">
                Your dream job<br />
                starts with a<br />
                <em style={{ color: "#0d9488", fontStyle: "italic" }}>great resume.</em>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
                Build a professional, ATS-optimized resume in minutes. Choose a template,
                fill in your details with AI guidance, and download instantly.
              </p>

              {/* ── 3 START OPTIONS ───────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {/* Build from scratch */}
                <button
                  onClick={onStart}
                  className="group flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 8px 24px rgba(13,148,136,0.3)" }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div>Build from Scratch</div>
                    <div className="text-white/70 text-xs font-normal">Start with a blank slate</div>
                  </div>
                </button>

                {/* Upload existing CV */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm border-2 transition-all hover:scale-105 bg-white"
                  style={{ borderColor: "#0d9488", color: "#0d9488" }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: "#f0fdfa" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div>Upload My CV</div>
                    <div className="text-xs font-normal" style={{ color: "#5eead4" }}>TXT, DOC, PDF supported</div>
                  </div>
                </button>
              </div>

              {/* Load sample link */}
              <button
                onClick={onSample}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-teal-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Or view a sample resume first
              </button>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-10 pt-8 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {["#0d9488","#0f766e","#115e59","#134e4a","#0d9488"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: c }}>
                      {["A","B","C","D","E"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">50,000+ resumes created</div>
                  <div className="text-xs text-slate-400">⭐⭐⭐⭐⭐ &nbsp;4.8 average rating</div>
                </div>
              </div>
            </div>

            {/* Right: live template preview cards */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[520px]">
                {/* Main card */}
                <div className="absolute top-0 left-8 w-72 shadow-2xl rounded-2xl overflow-hidden border border-slate-100 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="text-[0.25rem] scale-[0.33] origin-top-left w-[300%] h-[300%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template="Modern" />
                  </div>
                </div>
                {/* Back card */}
                <div className="absolute top-8 left-40 w-64 shadow-xl rounded-2xl overflow-hidden border border-slate-100 rotate-[4deg] hover:rotate-1 transition-transform duration-500">
                  <div className="text-[0.25rem] scale-[0.33] origin-top-left w-[300%] h-[300%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template="Elegant" />
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#f0fdfa" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">PDF Ready</div>
                    <div className="text-xs text-slate-400">Download instantly</div>
                  </div>
                </div>
                <div className="absolute top-4 right-0 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">AI Writing</div>
                    <div className="text-xs text-slate-400">Auto-generates content</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPLOAD DROP ZONE (visible on mobile as alternative) ─────────── */}
      <section className="px-6 lg:px-12 py-6 lg:hidden">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 transition-all"
          style={{ borderColor: "#99f6e4", background: "#f0fdfa" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "#ccfbf1" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm" style={{ color: "#0f766e" }}>Upload Your Existing CV</div>
            <div className="text-xs text-slate-400 mt-1">TXT, DOC, DOCX, PDF — we'll import what we can</div>
          </div>
        </button>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" className="px-6 lg:px-12 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Simple process</p>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-4xl font-normal text-slate-900">3 steps to your dream resume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", icon: "🎨", title: "Pick a Template",      desc: "Choose from 6 professionally designed, ATS-friendly layouts. Every template is HR-reviewed." },
              { n: "02", icon: "✍️", title: "Fill Your Details",    desc: "Add your experience with AI-powered suggestions. Let our AI write bullet points and summaries." },
              { n: "03", icon: "⚡", title: "Download Instantly",   desc: "Export your polished resume as PDF on any device — desktop or mobile — in one tap." },
            ].map((s) => (
              <div key={s.n} className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-6xl font-black absolute top-6 right-6 leading-none"
                  style={{ color: "#f0fdfa", WebkitTextStroke: "2px #99f6e4" }}>
                  {s.n}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ────────────────────────────────────────────────────── */}
      <section id="templates" className="px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Pick your style</p>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-4xl font-normal text-slate-900 mb-4">Professional templates</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Every template is ATS-optimized, HR-approved, and fully customizable. Switch anytime in the builder.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {TEMPLATE_NAMES.map((tmpl) => (
              <div
                key={tmpl}
                onClick={() => { setTemplate(tmpl); onStart(); }}
                className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent hover:border-teal-400 transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: TEMPLATE_THEMES[tmpl].bg }}
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template={tmpl} />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(to top, rgba(13,148,136,0.9) 0%, transparent 60%)" }}>
                    <span className="text-white text-sm font-bold">Use this template →</span>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{tmpl}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#f0fdfa", color: "#0d9488" }}>ATS ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 lg:px-12 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Why ResumeForge</p>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-4xl font-normal text-slate-900">Everything you need to get hired</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "🤖", title: "AI Content Generation",     desc: "Describe your role and let AI craft powerful bullet points, professional summaries, and relevant skills — optimized for ATS." },
              { icon: "📱", title: "Works on Any Device",        desc: "Build and download your resume from your phone, tablet, or laptop. Fully responsive with mobile PDF export." },
              { icon: "⚡", title: "Live Preview",               desc: "Watch your resume update in real-time as you type. No lag, no surprises — what you see is what you get." },
              { icon: "📤", title: "Import Existing CV",         desc: "Already have a CV? Upload your existing document and we'll pre-fill your information so you can edit and upgrade it." },
              { icon: "🎨", title: "6 Premium Templates",        desc: "Modern, Classic, Creative, Minimal, Bold, and Elegant — each crafted to impress hiring managers." },
              { icon: "📄", title: "PDF Download Everywhere",    desc: "One-tap PDF export works perfectly on iOS, Android, Windows, and Mac. Your resume, your way, anywhere." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                <div className="text-3xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center rounded-3xl py-16 px-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)" }}>
          {/* dot pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              className="text-4xl font-normal text-white mb-4">Ready to land your dream job?</h2>
            <p className="text-teal-100 mb-8 text-lg">Create your resume in under 10 minutes. No design skills needed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onStart}
                className="bg-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105 shadow-lg"
                style={{ color: "#0d9488" }}
              >
                Build from Scratch
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:bg-white/10"
              >
                Upload My CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="px-6 lg:px-12 py-10 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
              R
            </div>
            <span className="font-extrabold text-slate-800">
              Resume<span style={{ color: "#0d9488" }}>Forge</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">© 2025 ResumeForge · Helping you land jobs faster</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#templates" className="hover:text-teal-600 transition-colors">Templates</a>
            <a href="#features"  className="hover:text-teal-600 transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
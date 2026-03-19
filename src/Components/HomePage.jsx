import { useRef, useState } from "react";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_THEMES, TEMPLATE_NAMES } from "../utils/Constants";
import { SAMPLE_DATA } from "../App";
import { parseCV, readFileAsText } from "../utils/cvParser";

export default function HomePage({ onStart, onSample, onUpload, setTemplate }) {
  const fileInputRef  = useRef(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const text   = await readFileAsText(file);
      const parsed = parseCV(text);
      onUpload(parsed);
    } catch (err) {
      console.error(err);
      setUploadError("Couldn't read that file. Try saving your CV as .txt first.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const triggerUpload = () => { setMenuOpen(false); fileInputRef.current?.click(); };
  const handleStart   = () => { setMenuOpen(false); onStart(); };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden"
      style={{ fontFamily: "'Outfit','DM Sans',system-ui,sans-serif" }}>
      <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" />

      <input ref={fileInputRef} type="file" accept=".txt,.doc,.docx,.pdf,.rtf"
        className="hidden" onChange={handleFileChange} />

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-slate-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>R</div>
          <span className="font-extrabold text-xl tracking-tight">
            Resume<span style={{ color: "#0d9488" }}>Forge</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#how"       className="hover:text-teal-600 transition-colors">How it works</a>
          <a href="#templates" className="hover:text-teal-600 transition-colors">Templates</a>
          <a href="#features"  className="hover:text-teal-600 transition-colors">Features</a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={triggerUpload}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl border-2 transition-all hover:bg-teal-50"
            style={{ color: "#0d9488", borderColor: "#99f6e4" }}>
            Upload CV
          </button>
          <button onClick={onStart}
            className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105 shadow-md"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
            Build Resume →
          </button>
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────── */}
        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen((o) => !o)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
            aria-label="Menu">
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{ background: menuOpen ? "#0d9488" : "#334155", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{ background: "#334155", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{ background: menuOpen ? "#0d9488" : "#334155", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              <div className="p-2">
                <button onClick={handleStart}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">Build from Scratch</div>
                    <div className="text-xs text-slate-400">Start with a blank template</div>
                  </div>
                </button>

                <button onClick={triggerUpload}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#f0fdfa" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">Upload My CV</div>
                    <div className="text-xs text-slate-400">Import from TXT, DOC, PDF</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-2" />
                {[{ href: "#how", label: "How it works" }, { href: "#templates", label: "Templates" }, { href: "#features", label: "Features" }].map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-teal-600 rounded-xl hover:bg-slate-50 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Loading overlay */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl mx-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
              style={{ background: "#f0fdfa" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-900">Reading your CV…</div>
              <div className="text-sm text-slate-500 mt-1">Extracting your information</div>
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {uploadError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-medium max-w-sm text-center">
          {uploadError}
          <button onClick={() => setUploadError("")} className="ml-3 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative px-6 lg:px-12 pt-16 pb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: "radial-gradient(circle,#0d9488 0%,transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(#0d9488 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6 border"
                style={{ color: "#0d9488", background: "#f0fdfa", borderColor: "#99f6e4" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                AI-Powered · Free to use
              </div>

              <h1 style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
                className="text-5xl lg:text-6xl font-normal leading-[1.1] mb-6 text-slate-900">
                Your dream job<br />starts with a<br />
                <em style={{ color: "#0d9488", fontStyle: "italic" }}>great resume.</em>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
                Build a professional, ATS-optimized resume in minutes with AI guidance. Download instantly on any device.
              </p>

              {/* Desktop hero CTAs */}
              <div className="hidden sm:flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={onStart}
                  className="group flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", boxShadow: "0 8px 24px rgba(13,148,136,0.3)" }}>
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

                <button onClick={triggerUpload}
                  className="group flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm border-2 transition-all hover:scale-105 bg-white"
                  style={{ borderColor: "#0d9488", color: "#0d9488" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#f0fdfa" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div>Upload My CV</div>
                    <div className="text-xs font-normal" style={{ color: "#5eead4" }}>TXT, DOC, PDF</div>
                  </div>
                </button>
              </div>

              {/* Mobile hint */}
              <div className="sm:hidden mb-6 p-4 rounded-2xl border flex items-center gap-3"
                style={{ background: "#f0fdfa", borderColor: "#99f6e4" }}>
                <span className="text-2xl">☰</span>
                <div>
                  <div className="font-bold text-sm" style={{ color: "#0f766e" }}>Tap the menu to get started</div>
                  <div className="text-xs text-slate-500">Build from scratch or upload your existing CV</div>
                </div>
              </div>

              <button onClick={onSample}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-teal-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Or view a sample resume first
              </button>

              <div className="flex items-center gap-3 mt-10 pt-8 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {["#0d9488","#0f766e","#115e59","#134e4a","#0d9488"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: c }}>{["A","B","C","D","E"][i]}</div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">50,000+ resumes created</div>
                  <div className="text-xs text-slate-400">⭐⭐⭐⭐⭐ 4.8 average rating</div>
                </div>
              </div>
            </div>

            {/* Right preview cards */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[520px]">
                <div className="absolute top-0 left-8 w-72 shadow-2xl rounded-2xl overflow-hidden border border-slate-100 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template="Modern" />
                  </div>
                </div>
                <div className="absolute top-8 left-44 w-60 shadow-xl rounded-2xl overflow-hidden border border-slate-100 rotate-[4deg] hover:rotate-1 transition-transform duration-500">
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template="Elegant" />
                  </div>
                </div>
                <div className="absolute bottom-16 left-2 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f0fdfa" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div><div className="text-sm font-bold text-slate-800">PDF Ready</div><div className="text-xs text-slate-400">Download instantly</div></div>
                </div>
                <div className="absolute top-4 right-0 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <div><div className="text-xs font-bold text-slate-800">AI Writing</div><div className="text-xs text-slate-400">Auto-generates content</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how" className="px-6 lg:px-12 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Simple process</p>
            <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
              className="text-4xl font-normal text-slate-900">3 steps to your dream resume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: "🎨", title: "Pick a Template",    desc: "Choose from 6 professionally designed, ATS-friendly layouts. Every template is HR-reviewed." },
              { n: "02", icon: "✍️",  title: "Fill Your Details",  desc: "Add your experience with AI suggestions. Let AI write bullet points and summaries for you." },
              { n: "03", icon: "⚡",  title: "Download Instantly", desc: "Downloads as an HTML file. Open it → Ctrl+P → Save as PDF. Works perfectly on mobile too." },
            ].map((s) => (
              <div key={s.n} className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-6xl font-black absolute top-6 right-6 leading-none select-none"
                  style={{ color: "#f0fdfa", WebkitTextStroke: "2px #99f6e4" }}>{s.n}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ────────────────────────────────────────────────── */}
      <section id="templates" className="px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Pick your style</p>
            <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
              className="text-4xl font-normal text-slate-900 mb-4">Professional templates</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">ATS-optimized and fully customizable. Switch anytime inside the builder.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {TEMPLATE_NAMES.map((tmpl) => (
              <div key={tmpl} onClick={() => { setTemplate(tmpl); onStart(); }}
                className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent hover:border-teal-400 transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: TEMPLATE_THEMES[tmpl].bg }}>
                <div className="aspect-[3/4] overflow-hidden relative">
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template={tmpl} />
                  </div>
                  <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(to top,rgba(13,148,136,0.9) 0%,transparent 60%)" }}>
                    <span className="text-white text-sm font-bold">Use this template →</span>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{tmpl}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#f0fdfa", color: "#0d9488" }}>ATS ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="px-6 lg:px-12 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0d9488" }}>Why ResumeForge</p>
            <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
              className="text-4xl font-normal text-slate-900">Everything you need to get hired</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "🤖", title: "AI Content Generation",  desc: "Let AI craft powerful bullet points, professional summaries, and relevant skills — ATS-optimized." },
              { icon: "📱", title: "Works on Any Device",     desc: "Build your resume from phone, tablet, or laptop. Fully responsive with mobile-friendly download." },
              { icon: "⚡", title: "Live Preview",            desc: "Watch your resume update in real-time as you type. What you see is what you get." },
              { icon: "📤", title: "Import Existing CV",      desc: "Upload your document and we'll extract your name, experience, education, and skills automatically." },
              { icon: "🎨", title: "6 Premium Templates",     desc: "Modern, Classic, Creative, Minimal, Bold, and Elegant — each crafted to impress hiring managers." },
              { icon: "📄", title: "Download Anywhere",       desc: "Downloads as a clean HTML file. Open it → press Ctrl+P → Save as PDF. Works on every device." },
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

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center rounded-3xl py-16 px-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0d9488 0%,#0f766e 50%,#115e59 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(white 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
              className="text-4xl font-normal text-white mb-4">Ready to land your dream job?</h2>
            <p className="text-teal-100 mb-8 text-lg">Create your resume in under 10 minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onStart}
                className="bg-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105 shadow-lg"
                style={{ color: "#0d9488" }}>Build from Scratch</button>
              <button onClick={triggerUpload}
                className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:bg-white/10">
                Upload My CV</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="px-6 lg:px-12 py-10 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>R</div>
            <span className="font-extrabold text-slate-800">Resume<span style={{ color: "#0d9488" }}>Forge</span></span>
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
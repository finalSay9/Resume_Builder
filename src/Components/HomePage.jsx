import Icon from "./Icon";
import ResumePreview from "./ResumeReview";
import { TEMPLATE_THEMES, TEMPLATE_NAMES } from "../utils/Constants";
import { SAMPLE_DATA } from "../App";

export default function HomePage({ onStart, onSample, setTemplate }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-x-hidden">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 z-50 bg-slate-950/90 backdrop-blur">
        <div className="flex items-center gap-2">
          
          <span className="font-bold text-lg tracking-tight">ResuMint</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#templates" className="hover:text-white transition-colors">Templates</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
        </div>
        <button
          onClick={onStart}
          className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Build My Resume
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Icon name="sparkle" size={12} /> AI-Powered Resume Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Build a Standout Resume
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Create a job-winning resume with AI assistance, beautiful templates,
            and expert guidance. Download as PDF instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStart}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 text-base"
            >
              Build My Resume — Free
            </button>
            <button
              onClick={onSample}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-base"
            >
              View Sample Resume
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-sm">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={12} />)}
            </div>
            <span>4.8 · Trusted by 50,000+ job seekers</span>
          </div>
        </div>
      </section>

      {/* ── Templates ────────────────────────────────────────────────────── */}
      <section id="templates" className="px-6 py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">
            Professional Templates
          </h2>
          <p className="text-slate-400 text-center mb-10">
            6 ATS-friendly designs for every career level
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATE_NAMES.map((tmpl) => (
              <div
                key={tmpl}
                onClick={() => { setTemplate(tmpl); onStart(); }}
                className="group bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all hover:scale-105"
              >
                <div
                  className="aspect-[3/4] rounded-lg mb-3 overflow-hidden"
                  style={{ background: TEMPLATE_THEMES[tmpl].bg }}
                >
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    <ResumePreview data={SAMPLE_DATA} template={tmpl} />
                  </div>
                </div>
                <div className="text-sm font-bold text-center group-hover:text-indigo-400 transition-colors">
                  {tmpl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">
            Everything You Need
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Powerful features to land your dream job
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "sparkle",
                title: "AI Content Generation",
                desc: "Let AI write your summary, bullet points, and skills based on your role and experience.",
              },
              {
                icon: "eye",
                title: "Live Preview",
                desc: "See exactly how your resume looks as you type. No surprises when you download.",
              },
              {
                icon: "download",
                title: "Instant Download",
                desc: "Export your resume as a print-ready PDF in one click. ATS-optimized formatting.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how" className="px-6 py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12">
            3 Steps to Your Dream Resume
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Choose a Template", desc: "Pick from 6 beautiful, ATS-optimized designs" },
              { n: "02", title: "Fill in Your Details", desc: "Add your info with AI suggestions to guide you" },
              { n: "03", title: "Download & Apply", desc: "Export as PDF and start landing interviews" },
            ].map((s) => (
              <div key={s.n}>
                <div className="text-5xl font-black text-indigo-500/30 mb-3">{s.n}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onStart}
            className="mt-12 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 text-lg"
          >
            Start Building Now →
          </button>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2025 ResumeForge · Built to help you land jobs faster
      </footer>
    </div>
  );
}

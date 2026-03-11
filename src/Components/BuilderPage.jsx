
  // ── BUILDER PAGE ───────────────────────────────────────────────────────────
  const sections = [
    { id: "personal", label: "Personal" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "extras", label: "Extras" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("home")} className="text-slate-500 hover:text-slate-800 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-white text-xs">R</div>
            <span className="font-bold text-slate-900 hidden sm:block">ResumeForge</span>
          </div>
        </div>

        {/* Template Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {TEMPLATES.map(t => (
            <button key={t} onClick={() => setTemplate(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${template === t ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Mobile template + actions */}
        <div className="flex items-center gap-2">
          <select value={template} onChange={e => setTemplate(e.target.value)}
            className="md:hidden text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {TEMPLATES.map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="md:hidden flex items-center gap-1 bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
            <Icon name={showMobilePreview ? "edit" : "eye"} size={13}/>
            {showMobilePreview ? "Edit" : "Preview"}
          </button>
          <button onClick={printResume}
            className="hidden md:flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">
            <Icon name="download" size={15}/> Download PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL: FORM ─────────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "hidden" : "flex"} md:flex flex-col w-full md:w-[420px] lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0`}>
          {/* Section Nav */}
          <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto sticky top-0 bg-white z-10">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${activeSection === s.id ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-5 flex-1">
            {/* PERSONAL */}
            {activeSection === "personal" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Personal Information</h2>
                <Input label="Full Name" value={data.name} onChange={v => updateData("name", v)} placeholder="Alex Johnson"/>
                <Input label="Job Title" value={data.title} onChange={v => updateData("title", v)} placeholder="Senior Product Designer"/>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Email" value={data.email} onChange={v => updateData("email", v)} placeholder="alex@email.com"/>
                  <Input label="Phone" value={data.phone} onChange={v => updateData("phone", v)} placeholder="+1 555 234 5678"/>
                </div>
                <Input label="Location" value={data.location} onChange={v => updateData("location", v)} placeholder="San Francisco, CA"/>
                <Input label="Website / LinkedIn" value={data.website} onChange={v => updateData("website", v)} placeholder="linkedin.com/in/yourname"/>
                <button onClick={loadSample} className="mt-2 w-full text-xs text-indigo-500 hover:text-indigo-700 font-semibold border border-dashed border-indigo-300 py-2 rounded-lg transition-colors">
                  Load Sample Data
                </button>
              </div>
            )}

            {/* SUMMARY */}
            {activeSection === "summary" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Professional Summary</h2>
                <Textarea label="Summary" value={data.summary} onChange={v => updateData("summary", v)}
                  placeholder="Write a compelling 2-3 sentence summary highlighting your expertise and value..." rows={5}/>
                <button onClick={() => aiEnhance("summary")} disabled={!!aiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 text-sm">
                  {aiLoading === "summary" ? <span className="animate-spin">✦</span> : <Icon name="sparkle" size={15}/>}
                  {aiLoading === "summary" ? "AI is writing..." : "Generate with AI"}
                </button>
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
                        <button onClick={() => updateData("experience", data.experience.filter(e => e.id !== exp.id))}
                          className="text-red-400 hover:text-red-600 transition-colors"><Icon name="trash" size={14}/></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Job Title" value={exp.role} onChange={v => { const n = [...data.experience]; n[idx].role = v; updateData("experience", n); }} placeholder="Senior Designer"/>
                      <Input label="Company" value={exp.company} onChange={v => { const n = [...data.experience]; n[idx].company = v; updateData("experience", n); }} placeholder="Stripe"/>
                    </div>
                    <Input label="Period" value={exp.period} onChange={v => { const n = [...data.experience]; n[idx].period = v; updateData("experience", n); }} placeholder="2021 – Present"/>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Bullet Points</label>
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input value={b} onChange={e => { const n = [...data.experience]; n[idx].bullets[bi] = e.target.value; updateData("experience", n); }}
                          placeholder={`Achievement ${bi + 1}...`}
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"/>
                        {exp.bullets.length > 1 && (
                          <button onClick={() => { const n = [...data.experience]; n[idx].bullets = exp.bullets.filter((_, i) => i !== bi); updateData("experience", n); }}
                            className="text-red-400 hover:text-red-600"><Icon name="trash" size={13}/></button>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { const n = [...data.experience]; n[idx].bullets = [...exp.bullets, ""]; updateData("experience", n); }}
                        className="flex-1 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-indigo-600 border border-dashed border-slate-300 hover:border-indigo-300 py-1.5 rounded-lg transition-all">
                        <Icon name="plus" size={12}/> Add bullet
                      </button>
                      <button onClick={() => aiEnhance("bullets")} disabled={!!aiLoading || !exp.role}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg transition-all disabled:opacity-50">
                        {aiLoading === "bullets" ? <span className="animate-spin text-xs">✦</span> : <Icon name="sparkle" size={12}/>}
                        AI Bullets
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateData("experience", [...data.experience, { id: Date.now(), company: "", role: "", period: "", bullets: [""] }])}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 py-3 rounded-xl transition-all text-sm font-semibold">
                  <Icon name="plus" size={15}/> Add Position
                </button>
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
                        <button onClick={() => updateData("education", data.education.filter(e => e.id !== edu.id))}
                          className="text-red-400 hover:text-red-600"><Icon name="trash" size={14}/></button>
                      )}
                    </div>
                    <Input label="School / University" value={edu.school} onChange={v => { const n = [...data.education]; n[idx].school = v; updateData("education", n); }} placeholder="MIT"/>
                    <Input label="Degree & Field" value={edu.degree} onChange={v => { const n = [...data.education]; n[idx].degree = v; updateData("education", n); }} placeholder="BS Computer Science"/>
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Graduation Year" value={edu.year} onChange={v => { const n = [...data.education]; n[idx].year = v; updateData("education", n); }} placeholder="2020"/>
                      <Input label="GPA (optional)" value={edu.gpa} onChange={v => { const n = [...data.education]; n[idx].gpa = v; updateData("education", n); }} placeholder="3.9"/>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateData("education", [...data.education, { id: Date.now(), school: "", degree: "", year: "", gpa: "" }])}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 py-3 rounded-xl transition-all text-sm font-semibold">
                  <Icon name="plus" size={15}/> Add Education
                </button>
              </div>
            )}

            {/* SKILLS */}
            {activeSection === "skills" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <input value={skill} onChange={e => { const n = [...data.skills]; n[i] = e.target.value; updateData("skills", n); }}
                        className="bg-transparent outline-none w-20 min-w-0" placeholder="Skill..."/>
                      <button onClick={() => updateData("skills", data.skills.filter((_, si) => si !== i))} className="text-indigo-400 hover:text-red-500 ml-1">×</button>
                    </div>
                  ))}
                  <button onClick={() => updateData("skills", [...data.skills, ""])}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-slate-300 hover:border-indigo-300 transition-all">
                    <Icon name="plus" size={11}/> Add skill
                  </button>
                </div>
                <button onClick={() => aiEnhance("skills")} disabled={!!aiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 text-sm mt-2">
                  {aiLoading === "skills" ? <span className="animate-spin">✦</span> : <Icon name="sparkle" size={15}/>}
                  {aiLoading === "skills" ? "Generating skills..." : "Suggest Skills with AI"}
                </button>
              </div>
            )}

            {/* EXTRAS */}
            {activeSection === "extras" && (
              <div>
                <h2 className="text-base font-black text-slate-900 mb-4">Additional Sections</h2>
                {/* Certifications */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Certifications</label>
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={cert} onChange={e => { const n = [...data.certifications]; n[i] = e.target.value; updateData("certifications", n); }}
                        placeholder="Google UX Design Certificate"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
                      {data.certifications.length > 1 && (
                        <button onClick={() => updateData("certifications", data.certifications.filter((_, ci) => ci !== i))} className="text-red-400"><Icon name="trash" size={13}/></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => updateData("certifications", [...data.certifications, ""])}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1">
                    <Icon name="plus" size={12}/> Add certification
                  </button>
                </div>
                {/* Languages */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Languages</label>
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={lang} onChange={e => { const n = [...data.languages]; n[i] = e.target.value; updateData("languages", n); }}
                        placeholder="English (Native)"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
                      {data.languages.length > 1 && (
                        <button onClick={() => updateData("languages", data.languages.filter((_, li) => li !== i))} className="text-red-400"><Icon name="trash" size={13}/></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => updateData("languages", [...data.languages, ""])}
                    className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1">
                    <Icon name="plus" size={12}/> Add language
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Download */}
          <div className="md:hidden p-4 border-t border-slate-200">
            <button onClick={printResume} className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold py-3 rounded-xl">
              <Icon name="download" size={16}/> Download PDF
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: PREVIEW ──────────────────────────────────────────── */}
        <div className={`${showMobilePreview ? "flex" : "hidden"} md:flex flex-1 bg-slate-200 overflow-y-auto items-start justify-center p-6`}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview · {template} Template</span>
              <button onClick={printResume} className="hidden md:flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800">
                <Icon name="download" size={12}/> Print / Save PDF
              </button>
            </div>
            <div ref={previewRef} className="bg-white shadow-2xl rounded-xl overflow-hidden" style={{ minHeight: "800px" }}>
              <ResumePreview data={data} template={template}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
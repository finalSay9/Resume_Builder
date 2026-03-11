// ─── RESUME PREVIEW TEMPLATES ────────────────────────────────────────────────
function ResumePreview({ data, template }) {
  const t = TEMPLATE_THEMES[template] || TEMPLATE_THEMES.Modern;

  if (template === "Classic") return <ClassicTemplate data={data} t={t} />;
  if (template === "Creative") return <CreativeTemplate data={data} t={t} />;
  if (template === "Minimal") return <MinimalTemplate data={data} t={t} />;
  if (template === "Bold") return <BoldTemplate data={data} t={t} />;
  if (template === "Elegant") return <ElegantTemplate data={data} t={t} />;
  return <ModernTemplate data={data} t={t} />;
}
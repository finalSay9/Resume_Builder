import Section from "./Section";

export default function ModernTemplate({ data, t }) {
  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: t.bg,
        color: t.text,
        minHeight: "100%",
        fontSize: "10px",
      }}
    >
      {/* Header */}
      <div style={{ background: t.sidebar, color: "#fff", padding: "24px 28px 20px" }}>
        <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "0.5px" }}>
          {data.name || "Your Name"}
        </div>
        <div style={{ fontSize: "12px", color: t.accent, marginTop: "3px", fontStyle: "italic" }}>
          {data.title || "Your Title"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", fontSize: "9px", opacity: 0.85 }}>
          {data.email    && <span>✉ {data.email}</span>}
          {data.phone    && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.website  && <span>🌐 {data.website}</span>}
        </div>
      </div>

      <div style={{ padding: "20px 28px" }}>
        {data.summary && (
          <Section title="Profile" accent={t.accent}>
            <p style={{ lineHeight: "1.6", color: "#475569" }}>{data.summary}</p>
          </Section>
        )}

        {data.experience?.some((e) => e.company) && (
          <Section title="Experience" accent={t.accent}>
            {data.experience
              .filter((e) => e.company)
              .map((e) => (
                <div key={e.id} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: "700", fontSize: "11px" }}>{e.role}</span>
                    <span style={{ color: "#94a3b8", fontSize: "9px" }}>{e.period}</span>
                  </div>
                  <div style={{ color: t.accent, fontSize: "10px", marginBottom: "4px" }}>{e.company}</div>
                  <ul style={{ margin: "0", paddingLeft: "14px" }}>
                    {e.bullets.filter((b) => b).map((b, i) => (
                      <li key={i} style={{ marginBottom: "2px", lineHeight: "1.5" }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </Section>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {data.education?.some((e) => e.school) && (
            <Section title="Education" accent={t.accent}>
              {data.education
                .filter((e) => e.school)
                .map((e) => (
                  <div key={e.id} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "700", fontSize: "10px" }}>{e.degree}</div>
                    <div style={{ color: t.accent, fontSize: "9px" }}>{e.school}</div>
                    <div style={{ color: "#94a3b8", fontSize: "9px" }}>
                      {e.year}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
                    </div>
                  </div>
                ))}
            </Section>
          )}

          {data.skills?.some((s) => s) && (
            <Section title="Skills" accent={t.accent}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {data.skills.filter((s) => s).map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: `${t.accent}22`,
                      color: t.accent,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      fontSize: "9px",
                      fontWeight: "600",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {data.certifications?.some((c) => c) && (
          <Section title="Certifications" accent={t.accent}>
            {data.certifications.filter((c) => c).map((c, i) => (
              <div key={i} style={{ marginBottom: "3px" }}>• {c}</div>
            ))}
          </Section>
        )}

        {data.languages?.some((l) => l) && (
          <Section title="Languages" accent={t.accent}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {data.languages.filter((l) => l).map((l, i) => (
                <span key={i}>• {l}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
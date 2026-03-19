import ElegantSection from "./ElegantSection";

export default function ElegantTemplate({ data, t }) {
  return (
    <div
      style={{
        fontFamily: "'Garamond', 'Georgia', serif",
        background: t.bg,
        color: t.text,
        fontSize: "10px",
        padding: "28px 32px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "26px", fontWeight: "400", letterSpacing: "4px", textTransform: "uppercase", color: t.primary }}>
          {data.name || "Your Name"}
        </div>
        <div style={{ width: "60px", height: "1px", background: t.accent, margin: "10px auto" }} />
        <div style={{ fontSize: "11px", color: t.accent, letterSpacing: "2px", textTransform: "uppercase" }}>
          {data.title}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "10px", fontSize: "9px", color: "#777", flexWrap: "wrap" }}>
          {data.email    && <span>{data.email}</span>}
          {data.phone    && <span>· {data.phone}</span>}
          {data.location && <span>· {data.location}</span>}
          {data.website  && <span>· {data.website}</span>}
        </div>
      </div>

      {data.summary && (
        <div
          style={{
            borderTop: `1px solid ${t.accent}`,
            borderBottom: `1px solid ${t.accent}`,
            padding: "12px 0",
            marginBottom: "18px",
            textAlign: "center",
            fontStyle: "italic",
            color: "#555",
            lineHeight: "1.7",
          }}
        >
          {data.summary}
        </div>
      )}

      {data.experience?.some((e) => e.company) && (
        <>
          <ElegantSection title="Professional Experience" t={t} />
          {data.experience
            .filter((e) => e.company)
            .map((e) => (
              <div key={e.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: "700", fontSize: "11px" }}>{e.role}</span>
                  <span style={{ color: "#999", fontSize: "9px", fontStyle: "italic" }}>{e.period}</span>
                </div>
                <div style={{ color: t.accent, fontSize: "10px", marginBottom: "4px", fontStyle: "italic" }}>{e.company}</div>
                <ul style={{ margin: 0, paddingLeft: "16px", color: "#555" }}>
                  {e.bullets || [].map((b, i) => (
                    <li key={i} style={{ marginBottom: "2px" }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {data.education?.some((e) => e.school) && (
          <div>
            <ElegantSection title="Education" t={t} />
            {data.education
              .filter((e) => e.school)
              .map((e) => (
                <div key={e.id} style={{ marginBottom: "8px" }}>
                  <div style={{ fontWeight: "600" }}>{e.degree}</div>
                  <div style={{ color: t.accent, fontStyle: "italic", fontSize: "9.5px" }}>
                    {e.school}{e.year ? `, ${e.year}` : ""}
                  </div>
                </div>
              ))}
          </div>
        )}

        {data.skills?.some((s) => s) && (
          <div>
            <ElegantSection title="Expertise" t={t} />
            <p style={{ lineHeight: "1.8", color: "#555" }}>
              {data.skills.filter((s) => s).join(" · ")}
            </p>
          </div>
        )}
      </div>

      {data.certifications?.some((c) => c) && (
        <>
          <ElegantSection title="Certifications" t={t} />
          {data.certifications.filter((c) => c).map((c, i) => (
            <p key={i} style={{ marginBottom: "3px", color: "#555", fontStyle: "italic" }}>• {c}</p>
          ))}
        </>
      )}

      {data.languages?.some((l) => l) && (
        <>
          <ElegantSection title="Languages" t={t} />
          <p style={{ color: "#555" }}>{data.languages.filter((l) => l).join(" · ")}</p>
        </>
      )}
    </div>
  );
}
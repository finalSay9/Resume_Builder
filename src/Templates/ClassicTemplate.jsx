import ClassicSectionTitle from "./ClassicSectionTitle";

export default function ClassicTemplate({ data, t }) {
  return (
    <div
      style={{
        fontFamily: "'Times New Roman', serif",
        background: "#fff",
        color: "#1a1a1a",
        minHeight: "100%",
        fontSize: "10px",
        padding: "28px 32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: `2px solid ${t.accent}`,
          paddingBottom: "14px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase" }}>
          {data.name || "YOUR NAME"}
        </div>
        <div style={{ fontSize: "11px", color: t.accent, marginTop: "4px", letterSpacing: "1px" }}>
          {data.title}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px", fontSize: "9px", color: "#555" }}>
          {data.email    && <span>{data.email}</span>}
          {data.phone    && <span>|  {data.phone}</span>}
          {data.location && <span>|  {data.location}</span>}
        </div>
      </div>

      {data.summary && (
        <>
          <ClassicSectionTitle title="Objective" accent={t.accent} />
          <p style={{ lineHeight: "1.7", marginBottom: "14px" }}>{data.summary}</p>
        </>
      )}

      {data.experience?.some((e) => e.company) && (
        <>
          <ClassicSectionTitle title="Professional Experience" accent={t.accent} />
          {data.experience
            .filter((e) => e.company)
            .map((e) => (
              <div key={e.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{e.role}{e.company ? `, ${e.company}` : ""}</strong>
                  <span style={{ color: "#888" }}>{e.period}</span>
                </div>
                <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
                  {e.bullets || [].map((b, i) => (
                    <li key={i} style={{ marginBottom: "2px" }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
        </>
      )}

      {data.education?.some((e) => e.school) && (
        <>
          <ClassicSectionTitle title="Education" accent={t.accent} />
          {data.education
            .filter((e) => e.school)
            .map((e) => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span><strong>{e.degree}</strong>{e.school ? `, ${e.school}` : ""}</span>
                <span style={{ color: "#888" }}>{e.year}</span>
              </div>
            ))}
        </>
      )}

      {data.skills?.some((s) => s) && (
        <>
          <ClassicSectionTitle title="Skills" accent={t.accent} />
          <p>{data.skills.filter((s) => s).join(" · ")}</p>
        </>
      )}

      {data.certifications?.some((c) => c) && (
        <>
          <ClassicSectionTitle title="Certifications" accent={t.accent} />
          {data.certifications.filter((c) => c).map((c, i) => (
            <p key={i} style={{ marginBottom: "3px" }}>• {c}</p>
          ))}
        </>
      )}

      {data.languages?.some((l) => l) && (
        <>
          <ClassicSectionTitle title="Languages" accent={t.accent} />
          <p>{data.languages.filter((l) => l).join(" · ")}</p>
        </>
      )}
    </div>
  );
}
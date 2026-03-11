import BoldSection from "./BoldSection";

export default function BoldTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Impact', 'Arial Black', sans-serif", background: "#fff", fontSize: "10px" }}>
      {/* Header */}
      <div style={{ background: t.sidebar, color: "#fff", padding: "20px 24px 16px" }}>
        <div style={{ fontSize: "26px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px" }}>
          {data.name || "YOUR NAME"}
        </div>
        <div style={{ fontSize: "12px", color: t.accent, fontFamily: "Arial, sans-serif", marginTop: "2px" }}>
          {data.title}
        </div>
      </div>

      {/* Contact bar */}
      <div
        style={{
          background: t.accent, color: "#fff", padding: "8px 24px",
          display: "flex", gap: "20px", fontSize: "9px", fontFamily: "Arial, sans-serif", flexWrap: "wrap",
        }}
      >
        {data.email    && <span>✉ {data.email}</span>}
        {data.phone    && <span>📞 {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
        {data.website  && <span>🌐 {data.website}</span>}
      </div>

      <div style={{ padding: "20px 24px", fontFamily: "Arial, sans-serif" }}>
        {data.summary && (
          <>
            <BoldSection title="Profile" t={t} />
            <p style={{ lineHeight: "1.6", color: "#444", marginBottom: "14px" }}>{data.summary}</p>
          </>
        )}

        {data.experience?.some((e) => e.company) && (
          <>
            <BoldSection title="Experience" t={t} />
            {data.experience
              .filter((e) => e.company)
              .map((e) => (
                <div key={e.id} style={{ marginBottom: "12px", borderLeft: `3px solid ${t.accent}`, paddingLeft: "10px" }}>
                  <div style={{ fontWeight: "800", fontSize: "11px" }}>{e.role}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: t.sidebar, fontSize: "9px" }}>{e.company}</span>
                    <span style={{ color: "#aaa", fontSize: "9px" }}>{e.period}</span>
                  </div>
                  <ul style={{ margin: "4px 0", paddingLeft: "14px" }}>
                    {e.bullets.filter((b) => b).map((b, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {data.education?.some((e) => e.school) && (
            <div>
              <BoldSection title="Education" t={t} />
              {data.education
                .filter((e) => e.school)
                .map((e) => (
                  <div key={e.id} style={{ marginBottom: "6px" }}>
                    <div style={{ fontWeight: "700" }}>{e.degree}</div>
                    <div style={{ color: "#888", fontSize: "9px" }}>{e.school}{e.year ? ` · ${e.year}` : ""}</div>
                  </div>
                ))}
            </div>
          )}

          {data.skills?.some((s) => s) && (
            <div>
              <BoldSection title="Skills" t={t} />
              {data.skills.filter((s) => s).map((s, i) => (
                <div key={i} style={{ marginBottom: "4px" }}>
                  <div style={{ fontSize: "9px" }}>{s}</div>
                  <div style={{ height: "4px", background: "#eee", borderRadius: "2px", marginTop: "2px" }}>
                    <div style={{ height: "100%", width: `${65 + (i * 11) % 35}%`, background: t.accent, borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data.certifications?.some((c) => c) && (
          <>
            <BoldSection title="Certifications" t={t} />
            {data.certifications.filter((c) => c).map((c, i) => (
              <div key={i} style={{ marginBottom: "3px" }}>• {c}</div>
            ))}
          </>
        )}

        {data.languages?.some((l) => l) && (
          <>
            <BoldSection title="Languages" t={t} />
            <p>{data.languages.filter((l) => l).join(" · ")}</p>
          </>
        )}
      </div>
    </div>
  );
}
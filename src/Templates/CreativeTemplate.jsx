export default function CreativeTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", display: "flex", minHeight: "100%", fontSize: "10px" }}>
      <div style={{ width: "35%", background: t.sidebar, color: "#fff", padding: "24px 16px" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "900", marginBottom: "12px" }}>
          {(data.name || "?")[0]}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2" }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: "10px", color: t.accent, marginTop: "4px" }}>{data.title}</div>
        <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
          {data.email && <div style={{ marginBottom: "6px", fontSize: "9px" }}>✉ {data.email}</div>}
          {data.phone && <div style={{ marginBottom: "6px", fontSize: "9px" }}>📞 {data.phone}</div>}
          {data.location && <div style={{ marginBottom: "6px", fontSize: "9px" }}>📍 {data.location}</div>}
        </div>
        {data.skills?.some(s => s) && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: t.accent }}>Skills</div>
            {data.skills.filter(s => s).map((s, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "9px", marginBottom: "2px" }}>{s}</div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
                  <div style={{ height: "100%", width: `${70 + (i * 7) % 30}%`, background: t.accent, borderRadius: "2px" }}/>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.languages?.some(l => l) && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: t.accent }}>Languages</div>
            {data.languages.filter(l => l).map((l, i) => <div key={i} style={{ fontSize: "9px", marginBottom: "4px" }}>• {l}</div>)}
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: "24px 20px", background: t.bg }}>
        {data.summary && <><div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: t.primary, borderLeft: `3px solid ${t.accent}`, paddingLeft: "8px", marginBottom: "8px" }}>About Me</div><p style={{ lineHeight: "1.6", color: "#555", marginBottom: "16px", fontSize: "9.5px" }}>{data.summary}</p></>}
        {data.experience?.some(e => e.company) && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: t.primary, borderLeft: `3px solid ${t.accent}`, paddingLeft: "8px", marginBottom: "10px" }}>Experience</div>
            {data.experience.filter(e => e.company).map(e => (
              <div key={e.id} style={{ marginBottom: "12px", paddingLeft: "8px" }}>
                <div style={{ fontWeight: "700", fontSize: "10px" }}>{e.role}</div>
                <div style={{ color: t.accent, fontSize: "9px" }}>{e.company} · {e.period}</div>
                <ul style={{ margin: "4px 0", paddingLeft: "14px", color: "#555" }}>
                  {e.bullets.filter(b => b).map((b, i) => <li key={i} style={{ marginBottom: "2px" }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        {data.education?.some(e => e.school) && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: t.primary, borderLeft: `3px solid ${t.accent}`, paddingLeft: "8px", marginBottom: "10px" }}>Education</div>
            {data.education.filter(e => e.school).map(e => (
              <div key={e.id} style={{ paddingLeft: "8px", marginBottom: "8px" }}>
                <div style={{ fontWeight: "700" }}>{e.degree}</div>
                <div style={{ color: t.accent, fontSize: "9px" }}>{e.school} · {e.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

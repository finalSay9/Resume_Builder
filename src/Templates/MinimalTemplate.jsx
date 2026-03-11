function MinimalTemplate({ data, t }) {
  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", background: "#fff", color: "#111", fontSize: "10px", padding: "32px 36px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "28px", fontWeight: "300", letterSpacing: "-0.5px" }}>{data.name || "Your Name"}</div>
        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{data.title}</div>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "9px", color: "#aaa" }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>
      {data.summary && <><div style={{ width: "30px", height: "2px", background: "#111", marginBottom: "8px" }}/><p style={{ lineHeight: "1.7", color: "#444", marginBottom: "24px", maxWidth: "90%" }}>{data.summary}</p></>}
      {data.experience?.some(e => e.company) && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#aaa", marginBottom: "12px" }}>Work Experience</div>
          {data.experience.filter(e => e.company).map(e => (
            <div key={e.id} style={{ display: "flex", gap: "20px", marginBottom: "14px" }}>
              <div style={{ width: "80px", flexShrink: 0, color: "#aaa", fontSize: "9px", paddingTop: "1px" }}>{e.period}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600" }}>{e.role}</div>
                <div style={{ color: "#888", fontSize: "9px", marginBottom: "4px" }}>{e.company}</div>
                <ul style={{ margin: 0, paddingLeft: "14px", color: "#555" }}>
                  {e.bullets.filter(b => b).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {data.education?.some(e => e.school) && (
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#aaa", marginBottom: "10px" }}>Education</div>
            {data.education.filter(e => e.school).map(e => (
              <div key={e.id} style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "600" }}>{e.degree}</div>
                <div style={{ color: "#888", fontSize: "9px" }}>{e.school} · {e.year}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills?.some(s => s) && (
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#aaa", marginBottom: "10px" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {data.skills.filter(s => s).map((s, i) => <span key={i} style={{ border: "1px solid #ddd", padding: "2px 8px", fontSize: "9px", borderRadius: "2px" }}>{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
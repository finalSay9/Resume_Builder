export default function ElegantSection({ title, t }) {
  return (
    <div style={{ marginBottom: "10px", marginTop: "14px" }}>
      <div
        style={{
          fontSize: "9px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: t.accent,
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div style={{ height: "1px", background: `${t.accent}44` }} />
    </div>
  );
}

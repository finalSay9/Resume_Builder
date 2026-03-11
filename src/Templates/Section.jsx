export default function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `1px solid ${accent}33`,
          paddingBottom: "4px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

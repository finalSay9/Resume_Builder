export default function BoldSection({ title, t }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: "900",
        textTransform: "uppercase",
        color: t.sidebar,
        letterSpacing: "2px",
        borderBottom: `2px solid ${t.accent}`,
        paddingBottom: "3px",
        marginBottom: "10px",
        marginTop: "14px",
      }}
    >
      {title}
    </div>
  );
}
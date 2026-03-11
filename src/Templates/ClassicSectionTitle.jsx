export default function ClassicSectionTitle({ title, accent }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: "2px",
        borderBottom: `1px solid ${accent}`,
        paddingBottom: "4px",
        marginBottom: "10px",
        color: accent,
      }}
    >
      {title}
    </div>
  );
}
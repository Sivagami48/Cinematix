export default function DateStrip({ selected, onSelect }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
      {days.map((d) => {
        const value = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
        const active = value === selected;
        return (
          <div
            key={value}
            onClick={() => onSelect(value)}
            style={{
              minWidth: 70,
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 10,
              cursor: "pointer",
              background: active ? "var(--blue)" : "var(--card)",
            }}
          >
            <small>{d.toLocaleDateString("en-US", { weekday: "short" })}</small>
            <div style={{ fontSize: 20, fontWeight: "bold" }}>{d.getDate()}</div>
          </div>
        );
      })}
    </div>
  );
}
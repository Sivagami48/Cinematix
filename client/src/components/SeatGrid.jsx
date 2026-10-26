export default function SeatGrid({ rows, seatsPerRow, booked, selected, onToggle }) {
  const letters = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  ).reverse(); // G mela, A keezha (screenshot maari)

  const seatStyle = (id) => {
    const isBooked = booked.includes(id);
    const isSelected = selected.includes(id);
    return {
      width: 30,
      height: 30,
      fontSize: 12,
      padding: 0,
      borderRadius: 6,
      border: "1px solid var(--blue)",
      color: "white",
      cursor: isBooked ? "not-allowed" : "pointer",
      background: isBooked ? "#2a3347" : isSelected ? "var(--blue)" : "var(--card)",
      opacity: isBooked ? 0.5 : 1,
    };
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          textAlign: "center",
          letterSpacing: 6,
          color: "var(--muted)",
          borderTop: "3px solid var(--blue)",
          borderRadius: "50% 50% 0 0",
          padding: "10px 0",
          marginBottom: 20,
          minWidth: seatsPerRow * 36,
        }}
      >
        SCREEN
      </div>

      {letters.map((letter) => (
        <div
          key={letter}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 6,
            justifyContent: "center",
            alignItems: "center",
            minWidth: seatsPerRow * 36,
          }}
        >
          <span style={{ width: 16, color: "var(--muted)" }}>{letter}</span>
          {Array.from({ length: seatsPerRow }, (_, i) => {
            const id = `${letter}${i + 1}`;
            return (
              <button
                key={id}
                disabled={booked.includes(id)}
                onClick={() => onToggle(id)}
                style={seatStyle(id)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      ))}

      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          marginTop: 16,
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        <span>🟦 Selected</span>
        <span>⬛ Available</span>
        <span>▫️ Booked</span>
      </div>
    </div>
  );
}
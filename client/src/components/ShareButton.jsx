import { useState } from "react";

export default function ShareButton({ movie, date, show }) {
  const [copied, setCopied] = useState(false);

  const buildLink = () => {
    const url = new URL(`${window.location.origin}/movie/${movie._id}`);
    url.searchParams.set("date", date);
    if (show) url.searchParams.set("show", show._id);
    return url.toString();
  };

  const buildText = () => {
    const when = show
      ? `${date}, ${show.time}${show.theatre?.name ? " at " + show.theatre.name : ""}`
      : date;
    return `🎬 Let's watch ${movie.title} together! ${when}. Pick your seat here:`;
  };

  const share = async () => {
    const link = buildLink();
    const text = buildText();

    if (navigator.share) {
      try {
        await navigator.share({ title: movie.title, text, url: link });
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // user cancel pannitaan
      }
    }

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`,
      "_blank",
      "noopener"
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard block aana ignore pannu
    }
  };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "12px 0" }}>
      <button onClick={share}>📤 Share plan</button>
      <button onClick={copy} style={{ background: "#2a3347" }}>
        {copied ? "✓ Copied" : "🔗 Copy link"}
      </button>
    </div>
  );
}
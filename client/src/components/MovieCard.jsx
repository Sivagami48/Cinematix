// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function MovieCard({ movie }) {
//   const [imgFailed, setImgFailed] = useState(false);

//   return (
//     <Link to={`/movie/${movie._id}`}>
//       <div
//         style={{
//           background: "var(--card)",
//           borderRadius: 14,
//           overflow: "hidden",
//         }}
//       >
//         {imgFailed || !movie.poster ? (
//           <div
//             style={{
//               aspectRatio: "2 / 3",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: 12,
//               textAlign: "center",
//               fontWeight: "bold",
//               fontSize: 20,
//               background: "linear-gradient(135deg, #1e90ff, #0b1730)",
//             }}
//           >
//             {movie.title}
//           </div>
//         ) : (
//           <img
//             src={movie.poster}
//             alt={movie.title}
//             onError={() => setImgFailed(true)}
//             style={{
//               width: "100%",
//               aspectRatio: "2 / 3",
//               objectFit: "cover",
//               display: "block",
//             }}
//           />
//         )}
//         <div style={{ padding: 16 }}>
//           <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{movie.title}</h3>
//           <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
//             {movie.language} • ⭐ {movie.rating}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }





import { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, comingSoon, reminded, onRemind }) {
  const [imgFailed, setImgFailed] = useState(false);

  const releaseText = movie.releaseDate
    ? new Date(movie.releaseDate + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const poster = (
    <div className="mc-poster-wrap">
      {imgFailed || !movie.poster ? (
        <div className="mc-fallback">{movie.title}</div>
      ) : (
        <img
          className="mc-poster"
          src={movie.poster}
          alt={movie.title}
          onError={() => setImgFailed(true)}
        />
      )}
      {comingSoon && (
        <span className="mc-badge">📅 {releaseText || "Releasing Soon"}</span>
      )}
    </div>
  );

  if (comingSoon) {
    return (
      <div className="mc-card mc-soon">
        {poster}
        <div className="mc-body">
          <h3 className="mc-title">{movie.title}</h3>
          <p className="mc-meta">
            {[movie.language, movie.format].filter(Boolean).join(" • ") ||
              "Coming soon"}
          </p>
        </div>
        <div className="mc-remind">
          <button
            className={reminded ? "mc-btn done" : "mc-btn"}
            onClick={() => onRemind(movie._id)}
          >
            {reminded ? "✓ Reminder set" : "🔔 Remind me"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/movie/${movie._id}`} style={{ display: "block" }}>
      <div className="mc-card">
        {poster}
        <div className="mc-body">
          <h3 className="mc-title">{movie.title}</h3>
          <p className="mc-meta">
            {movie.language} • ⭐ {movie.rating}
          </p>
        </div>
      </div>
    </Link>
  );
}
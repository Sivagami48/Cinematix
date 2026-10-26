import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({ expiresAt, onExpire }) {
  const calc = () => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const [left, setLeft] = useState(calc);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    const timer = setInterval(() => {
      const s = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        clearInterval(timer);
        expireRef.current();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <span style={{ color: left < 60 ? "#ff6b6b" : "var(--blue)" }}>
      ⏱ {mm}:{ss}
    </span>
  );
}
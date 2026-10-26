import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};

export default function NotificationBell() {
  const { items, unread, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const openItem = (n) => {
    markRead(n._id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="nb-wrap" ref={ref}>
      <style>{`
        .nb-wrap {
          position: relative;
          display: inline-block;
        }

        .nb-btn {
          position: relative;
          padding: 8px 12px;
          border: 1px solid #24334a;
          border-radius: 10px;
          background: #0f1a30;
          color: #e6eefc;
          font-size: 16px;
          cursor: pointer;
        }

        .nb-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 18px;
          padding: 1px 5px;
          border-radius: 10px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 700;
        }

        .nb-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 10px);
          z-index: 1500;
          width: 340px;
          max-width: 90vw;
          border: 1px solid #24334a;
          border-radius: 14px;
          background: #0b1322;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .nb-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid #1b2b45;
          font-weight: 700;
          font-size: 14px;
        }

        .nb-link {
          border: none;
          background: none;
          color: #60a5fa;
          padding: 0;
          font-size: 12px;
          cursor: pointer;
        }

        .nb-list {
          max-height: 360px;
          overflow-y: auto;
        }

        .nb-item {
          display: block;
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-bottom: 1px solid #14213a;
          border-radius: 0;
          background: transparent;
          color: #cbd5e1;
          text-align: left;
          cursor: pointer;
        }

        .nb-item:hover {
          background: #101c33;
        }

        .nb-item.unread {
          background: rgba(37, 99, 235, 0.1);
        }

        .nb-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f1f5f9;
          font-size: 13px;
          font-weight: 700;
        }

        .nb-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #3b82f6;
        }

        .nb-msg {
          margin-top: 4px;
          font-size: 12px;
          line-height: 1.5;
        }

        .nb-time {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
        }

        .nb-empty {
          padding: 26px 14px;
          color: #8191a9;
          font-size: 13px;
          text-align: center;
        }
      `}</style>

      <button
        type="button"
        className="nb-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="nb-badge">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div className="nb-panel">
          <div className="nb-head">
            <span>Notifications</span>
            {unread > 0 && (
              <button type="button" className="nb-link" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="nb-list">
            {items.length === 0 ? (
              <div className="nb-empty">No notifications yet 🔕</div>
            ) : (
              items.map((n) => (
                <button
                  type="button"
                  key={n._id}
                  className={`nb-item ${n.read ? "" : "unread"}`}
                  onClick={() => openItem(n)}
                >
                  <div className="nb-title">
                    {!n.read && <span className="nb-dot" />}
                    {n.title}
                  </div>
                  <div className="nb-msg">{n.message}</div>
                  <div className="nb-time">{timeAgo(n.createdAt)}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
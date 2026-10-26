import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await API.get("/notifications");
      setItems(Array.isArray(data?.items) ? data.items : []);
      setUnread(Number(data?.unread) || 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUnread(0);
      return;
    }

    load();

    const sendAuth = () => socket.emit("auth", user.token);
    const onNotification = (n) => {
      setItems((prev) => [n, ...prev].slice(0, 30));
      setUnread((c) => c + 1);
      setToast(n);
    };

    if (socket.connected) sendAuth();
    socket.on("connect", sendAuth);
    socket.on("notification", onNotification);

    return () => {
      socket.off("connect", sendAuth);
      socket.off("notification", onNotification);
      socket.emit("unauth");
    };
  }, [user, load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const markAllRead = async () => {
    try {
      await API.patch("/notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch {
      // ignore
    }
  };

  const markRead = async (id) => {
    const target = items.find((n) => n._id === id);
    if (!target || target.read) return;
    try {
      await API.patch(`/notifications/${id}/read`);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnread((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  return (
    <NotificationContext.Provider
      value={{ items, unread, markAllRead, markRead }}
    >
      <style>{`
        .nt-toast {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 320px;
          padding: 14px 16px;
          border: 1px solid #315c9b;
          border-left: 4px solid #1e90ff;
          border-radius: 12px;
          background: #0f1a30;
          color: #e6eefc;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          font-size: 13px;
          animation: nt-in 0.25s ease;
        }

        .nt-toast span {
          color: #9fb2d1;
        }

        @keyframes nt-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 500px) {
          .nt-toast {
            left: 12px;
            right: 12px;
            max-width: none;
          }
        }
      `}</style>

      {children}

      {toast && (
        <Link
          to={toast.link || "/my-bookings"}
          className="nt-toast"
          onClick={() => setToast(null)}
        >
          <strong>{toast.title}</strong>
          <span>{toast.message}</span>
        </Link>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
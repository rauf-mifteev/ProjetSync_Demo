import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, ChevronDown, CheckCheck, UserPlus, ListChecks, Clock3, MessageSquare, ScrollText } from "lucide-react";
import Avatar from "./Avatar";
import { getNotifications, markAllNotificationsRead, markNotificationRead, logout } from "../lib/data";
import { relativeTime } from "./ui";

const TYPE_ICON = {
  task_assigned: ListChecks,
  task_due_soon: Clock3,
  task_commented: MessageSquare,
  member_joined: UserPlus,
  decision_logged: ScrollText,
};

export default function TopBar({ user, title, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const refresh = () => getNotifications(user._id).then(setNotifs);

  useEffect(() => { refresh(); }, [user._id]);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3.5 md:px-8">
      <div>
        <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative" ref={notifRef}>
          <button
            className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-20 mt-2 w-[22rem] overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-pop">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="font-display text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="focus-ring flex items-center gap-1 rounded-md text-xs font-medium text-brand-500 hover:text-brand-600"
                    onClick={() => markAllNotificationsRead(user._id).then(refresh)}
                  >
                    <CheckCheck size={14} /> Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {notifs.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">Aucune notification pour le moment.</p>
                ) : (
                  notifs.map((n) => {
                    const Icon = TYPE_ICON[n.type] || Bell;
                    return (
                      <button
                        key={n._id}
                        onClick={() => markNotificationRead(n._id).then(refresh)}
                        className={`focus-ring flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50 ${!n.isRead ? "bg-brand-50/50" : ""}`}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!n.isRead ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-400"}`}>
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className={`leading-snug ${!n.isRead ? "text-ink font-medium" : "text-slate-500"}`}>{n.message}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{relativeTime(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-slate-100"
            onClick={() => setUserOpen((v) => !v)}
          >
            <Avatar user={user} size={30} />
            <span className="hidden text-sm font-medium text-ink sm:block">{user.name.split(" ")[0]}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {userOpen && (
            <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-pop">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
              <button
                className="focus-ring flex w-full items-center gap-2 px-4 py-2.5 text-sm text-coral-500 hover:bg-slate-50"
                onClick={() => { logout(); onLogout(); }}
              >
                <LogOut size={15} /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

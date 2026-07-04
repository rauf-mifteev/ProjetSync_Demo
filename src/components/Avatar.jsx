export default function Avatar({ user, size = 32, ring = false }) {
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      title={user.name}
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${ring ? "ring-2 ring-white" : ""}`}
      style={{ width: size, height: size, background: user.avatarColor || "#3F51D6", fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ users, max = 4, size = 26 }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((u) => (
        <Avatar key={u._id} user={u} size={size} ring />
      ))}
      {extra > 0 && (
        <div
          className="inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold ring-2 ring-white"
          style={{ width: size, height: size, fontSize: size * 0.34 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

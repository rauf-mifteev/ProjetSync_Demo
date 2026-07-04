import { useEffect, useState } from "react";
import { UserPlus, Crown, X, Users } from "lucide-react";
import { getMyTeams, getTeam, inviteMember, removeMember, createTeam } from "../lib/data";
import Avatar from "../components/Avatar";
import { EmptyState, PageLoading, formatDate } from "../components/ui";

export default function TeamPage({ user }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyTeams(user._id).then(async (teams) => {
      const t = teams[0];
      if (cancelled) return;
      if (t) setTeam(await getTeam(t._id));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user._id]);

  async function refresh(teamId) { setTeam(await getTeam(teamId)); }

  async function handleInvite(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      await inviteMember(team._id, email);
      setSuccess(`${email} a été ajouté à l'équipe.`);
      setEmail("");
      await refresh(team._id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(userId) {
    try {
      await removeMember(team._id, userId);
      await refresh(team._id);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateTeam(e) {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    try {
      const created = await createTeam(newTeamName, user._id);
      setTeam(await getTeam(created._id));
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <PageLoading />;

  if (!team) {
    return (
      <div className="mx-auto max-w-md px-5 py-10">
        <EmptyState
          icon={Users}
          title="Créez votre première équipe"
          description="Une équipe compte entre 2 et 6 membres. Vous pourrez inviter vos coéquipiers juste après."
        />
        <form onSubmit={handleCreateTeam} className="mt-4 flex gap-2">
          <input className="input" placeholder="Nom de l'équipe" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
          <button className="btn-primary shrink-0" disabled={creating}>{creating ? "Création…" : "Créer"}</button>
        </form>
      </div>
    );
  }

  const membership = team.members.find((m) => (m.userId?._id || m.userId) === user._id);
  const isScrumMaster = membership?.role === "scrumMaster";

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ink">{team.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {team.members.length}/6 membres · Créée le {formatDate(team.createdAt)}
        </p>
      </div>

      <div className="card mb-5 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink">Membres</h3>
        <ul className="divide-y divide-slate-100">
          {team.members.map((m) => {
            const memberId = m.userId?._id || m.userId;
            return (
              <li key={memberId} className="flex items-center gap-3 py-3">
                <Avatar user={m.user} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {m.user.name} {memberId === user._id && <span className="text-slate-400">(vous)</span>}
                  </p>
                  <p className="truncate text-xs text-slate-400">{m.user.email}</p>
                </div>
                {m.role === "scrumMaster" ? (
                  <span className="flex items-center gap-1 rounded-full bg-gold-400/15 px-2.5 py-1 text-xs font-medium text-gold-500">
                    <Crown size={12} /> Scrum Master
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Membre</span>
                )}
                {isScrumMaster && memberId !== user._id && (
                  <button
                    onClick={() => handleRemove(memberId)}
                    className="focus-ring rounded-md p-1.5 text-slate-300 hover:bg-coral-400/10 hover:text-coral-500"
                    aria-label="Retirer ce membre"
                  >
                    <X size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {isScrumMaster && (
        <div className="card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-ink">Inviter un membre</h3>
          <p className="mb-4 text-xs text-slate-500">
            La personne doit déjà posséder un compte ProjetSync. Maximum 6 membres par équipe (RG-01).
          </p>
          <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email" className="input" placeholder="courriel@exemple.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              disabled={team.members.length >= 6}
            />
            <button className="btn-primary shrink-0" disabled={team.members.length >= 6}>
              <UserPlus size={16} /> Inviter
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-coral-500">{error}</p>}
          {success && <p className="mt-2 text-xs text-teal-500">{success}</p>}
          {team.members.length >= 6 && <p className="mt-2 text-xs text-slate-400">Équipe complète (6/6 membres).</p>}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { ArrowRight, Users2 } from "lucide-react";
import { login, register } from "../lib/data";
import LogoMark from "../components/LogoMark";
import LogoFull from "../components/LogoFull";

const DEMO_ACCOUNTS = [
  { name: "Rauf Mifteev", role: "Scrum Master / Backend", email: "rauf.mifteev@demo.projetsync.app" },
  { name: "Kevin Vazquez Boza", role: "Designer", email: "kevin.vb@demo.projetsync.app" },
];

export default function LoginPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      if (!form.name.trim()) return setError({ field: "name", message: "Le nom est requis." });
      if (form.password.length < 8) return setError({ field: "password", message: "8 caractères minimum." });
      if (form.password !== form.confirm) return setError({ field: "confirm", message: "Les mots de passe ne correspondent pas." });
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError({ field: "email", message: "Courriel invalide." });
    if (!form.password) return setError({ field: "password", message: "Le mot de passe est requis." });

    setLoading(true);
    try {
      const user = mode === "login"
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      onAuth(user);
    } catch (err) {
      setError({ field: err.field, message: err.message });
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(email) {
    setMode("login");
    setForm((f) => ({ ...f, email, password: "demo1234" }));
    setError(null);
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-600 p-10 text-white md:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="rounded-xl2 bg-white px-4 py-3 shadow-pop">
            <LogoFull width={150} showTagline={false} />
          </div>
        </div>

        <div className="relative max-w-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Réseau d'équipe</p>
          <h1 className="font-display text-3xl font-semibold leading-tight">
            Un seul endroit pour organiser vos travaux d'équipe.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Tâches, échéances et décisions au même endroit — pensé pour les équipes étudiantes de 2 à 6 personnes.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-xl2 bg-white/10 p-4 backdrop-blur-sm">
            <Users2 size={20} className="shrink-0" />
            <p className="text-xs leading-relaxed text-white/80">
              Projet TP1 — 420-319-AH. Cette démonstration tourne entièrement dans votre navigateur.
            </p>
          </div>
        </div>

        <p className="relative text-xs text-white/50">© 2026 Équipe ProjetSync</p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <LogoMark size={30} />
            <span className="font-display text-lg font-semibold text-ink">ProjetSync</span>
          </div>

          <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-1">
            {[
              ["login", "Connexion"],
              ["register", "Créer un compte"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(null); }}
                className={`focus-ring rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  mode === key ? "bg-white text-ink shadow-card" : "text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold text-ink">
            {mode === "login" ? "Ravi de vous revoir" : "Créez votre compte"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "login" ? "Connectez-vous pour accéder à vos équipes." : "Quelques secondes suffisent."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {mode === "register" && (
              <Field label="Nom complet" error={error?.field === "name" ? error.message : null}>
                <input
                  type="text" autoComplete="name" value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input" placeholder="Alex Martin"
                />
              </Field>
            )}
            <Field label="Courriel" error={error?.field === "email" ? error.message : null}>
              <input
                type="email" autoComplete="email" value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input" placeholder="vous@exemple.com"
              />
            </Field>
            <Field label="Mot de passe" error={error?.field === "password" ? error.message : null}>
              <input
                type="password" autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password} onChange={(e) => update("password", e.target.value)}
                className="input" placeholder="••••••••"
              />
            </Field>
            {mode === "register" && (
              <Field label="Confirmer le mot de passe" error={error?.field === "confirm" ? error.message : null}>
                <input
                  type="password" value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  className="input" placeholder="••••••••"
                />
              </Field>
            )}

            {mode === "login" && (
              <div className="text-right">
                <span className="cursor-not-allowed text-xs text-slate-300" title="Hors portée de la version 1">
                  Mot de passe oublié ?
                </span>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 rounded-xl2 border border-dashed border-slate-200 p-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Comptes de démonstration</p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc.email)}
                  className="focus-ring flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs hover:border-brand-400 hover:bg-brand-50"
                >
                  <span>
                    <span className="font-medium text-ink">{acc.name}</span>
                    <span className="text-slate-400"> · {acc.role}</span>
                  </span>
                  <span className="text-brand-500">Utiliser</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-coral-500">{error}</span>}
    </label>
  );
}

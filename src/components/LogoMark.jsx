// Icône seule du logo ProjetSync (sans le mot-symbole), recadrée pour un usage
// compact — favicon, barre latérale, en-têtes. Voir src/assets/logo-mark.svg
// pour la version fichier autonome (utilisée pour le favicon).
export default function LogoMark({ size = 32 }) {
  return (
    <svg viewBox="75 32 150 150" width={size} height={size} aria-hidden="true">
      <line x1="150" y1="100" x2="105" y2="65" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="100" x2="195" y2="65" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="100" x2="150" y2="150" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />

      <circle cx="105" cy="65" r="16" fill="#2B6194" />
      <circle cx="195" cy="65" r="16" fill="#2B6194" />
      <circle cx="150" cy="150" r="16" fill="#7CAADD" />

      <circle cx="150" cy="100" r="26" fill="#203A5A" />

      <polyline points="137,100 146,109 164,89" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

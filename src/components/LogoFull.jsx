// Logo complet (icône + mot-symbole + accroche), pour les emplacements de
// grande taille comme le panneau héros de la page de connexion.
export default function LogoFull({ width = 220, showTagline = true }) {
  const height = showTagline ? width : width * (170 / 300);
  return (
    <svg viewBox={`0 0 300 ${showTagline ? 270 : 170}`} width={width} height={height} role="img" aria-label="ProjetSync — Réseau d'équipe">
      <line x1="150" y1="100" x2="105" y2="65" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="100" x2="195" y2="65" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />
      <line x1="150" y1="100" x2="150" y2="150" stroke="#C1D5EB" strokeWidth="6" strokeLinecap="round" />

      <circle cx="105" cy="65" r="16" fill="#2B6194" />
      <circle cx="195" cy="65" r="16" fill="#2B6194" />
      <circle cx="150" cy="150" r="16" fill="#7CAADD" />

      <circle cx="150" cy="100" r="26" fill="#203A5A" />

      <polyline points="137,100 146,109 164,89" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      <text x="150" y="215" textAnchor="middle" fontFamily="'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif" fontWeight="700" fontSize="34" letterSpacing="-0.5">
        <tspan fill="#203A5A">Projet</tspan><tspan fill="#2B6194">Sync</tspan>
      </text>
      {showTagline && (
        <text x="150" y="250" textAnchor="middle" fontFamily="'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif" fontSize="18" fill="#6B7A8E">
          Réseau d'équipe
        </text>
      )}
    </svg>
  );
}

export default function StingLogo({ className = "", size = 48, animate = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}${animate ? " logo-glow" : ""}`}
      aria-label="sting logo"
    >
      {/* Stingray body */}
      <path
        d="M32 6 L58 30 L32 42 L6 30 Z"
        fill="#f5a623"
        opacity="0.95"
      />
      {/* Wing tips */}
      <path
        d="M58 30 L62 28 L56 34 Z"
        fill="#f5a623"
        opacity="0.8"
      />
      <path
        d="M6 30 L2 28 L8 34 Z"
        fill="#f5a623"
        opacity="0.8"
      />
      {/* Wing accents */}
      <path
        d="M32 6 L58 30 L50 26 L32 11 Z"
        fill="#ffd666"
        opacity="0.5"
      />
      <path
        d="M32 6 L6 30 L14 26 L32 11 Z"
        fill="#ffd666"
        opacity="0.5"
      />
      {/* Dorsal ridge */}
      <path
        d="M30 10 L32 6 L34 10 L32 42 Z"
        fill="#c7841a"
        opacity="0.4"
      />
      {/* Stingray tail */}
      <path
        d="M32 42 L33 50 L34 54 L32 60 L30 54 L31 50 Z"
        fill="#f5a623"
      />
      {/* Tail barb */}
      <path
        d="M32 54 L36 49 L33 56 L32 60 L31 56 L28 49 Z"
        fill="#c7841a"
      />
      {/* Serrated barb edges */}
      <path
        d="M36 49 L34 52 L35 50 Z"
        fill="#a06a14"
      />
      <path
        d="M28 49 L30 52 L29 50 Z"
        fill="#a06a14"
      />
      {/* Eye left */}
      <circle cx="25" cy="24" r="3" fill="#0f0f0f" />
      <circle cx="26" cy="23.5" r="1" fill="#ff4444" opacity="0.8" />
      <circle cx="26.2" cy="23.2" r="0.4" fill="#ffffff" opacity="0.9" />
      {/* Eye right */}
      <circle cx="39" cy="24" r="3" fill="#0f0f0f" />
      <circle cx="40" cy="23.5" r="1" fill="#ff4444" opacity="0.8" />
      <circle cx="40.2" cy="23.2" r="0.4" fill="#ffffff" opacity="0.9" />
      {/* Shield overlay */}
      <path
        d="M32 10 L48 24 L32 36 L16 24 Z"
        stroke="#faf6ed"
        strokeWidth="0.8"
        fill="none"
        opacity="0.2"
      />
      {/* Inner threat lines */}
      <path
        d="M32 14 L44 24 L32 32 L20 24 Z"
        stroke="#f5a623"
        strokeWidth="0.4"
        fill="none"
        opacity="0.15"
      />
    </svg>
  );
}

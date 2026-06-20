export default function StingLogo({ className = "", size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sting logo"
    >
      {/* Stingray body — sleek diamond shape */}
      <path
        d="M32 8 L56 32 L32 44 L8 32 Z"
        fill="#f5a623"
        opacity="0.9"
      />
      {/* Wing accents */}
      <path
        d="M32 8 L56 32 L48 28 L32 14 Z"
        fill="#ffd666"
        opacity="0.6"
      />
      <path
        d="M32 8 L8 32 L16 28 L32 14 Z"
        fill="#ffd666"
        opacity="0.6"
      />
      {/* Stingray tail — the "sting" */}
      <path
        d="M32 44 L33 52 L32 58 L31 52 Z"
        fill="#f5a623"
      />
      {/* Tail barb detail */}
      <path
        d="M32 52 L34 50 L32 58 L30 50 Z"
        fill="#c7841a"
      />
      {/* Eye left */}
      <circle cx="26" cy="26" r="2.5" fill="#0f0f0f" />
      <circle cx="26.8" cy="25.5" r="0.8" fill="#faf6ed" />
      {/* Eye right */}
      <circle cx="38" cy="26" r="2.5" fill="#0f0f0f" />
      <circle cx="38.8" cy="25.5" r="0.8" fill="#faf6ed" />
      {/* Shield outline overlay */}
      <path
        d="M32 12 L46 26 L32 38 L18 26 Z"
        stroke="#faf6ed"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

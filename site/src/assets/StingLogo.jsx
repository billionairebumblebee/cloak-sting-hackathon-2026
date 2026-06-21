export default function StingLogo({ className = "", size = 48, animate = false }) {
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`sting-logo ${className}${animate ? " logo-glow" : ""}`}
      aria-label="STING logo"
    >
      {/* Stingray body — fixed dark, matches reference art */}
      <path
        d="M32 4 C20 4 4 18 4 30 C4 40 16 48 32 48 C48 48 60 40 60 30 C60 18 44 4 32 4 Z"
        fill="#1a1a1a"
      />
      {/* Body curves */}
      <path
        d="M32 14 C28 20 26 28 28 38 C29 42 30 45 31 47"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M32 14 C36 20 38 28 36 38 C35 42 34 45 33 47"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Eyes */}
      <circle cx="24" cy="20" r="2" fill="white" />
      <circle cx="40" cy="20" r="2" fill="white" />
      {/* Tail */}
      <path
        d="M32 48 C32 52 32.5 58 33 64 C33.3 68 32.5 72 32 76"
        stroke="#1a1a1a"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function StingLogo({ className = "", size = 48, animate = false }) {
  return (
    <img
      src="/sting-mark.png"
      alt="STING logo"
      width={size}
      height={Math.round(size * 1.64)}
      className={`sting-logo ${className}${animate ? " logo-glow" : ""}`}
      style={{ objectFit: "contain" }}
    />
  );
}

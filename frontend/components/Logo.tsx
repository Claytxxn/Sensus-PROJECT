import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-2xl font-extrabold tracking-[0.12em] text-sensus-700 ${className}`}
      aria-label="SENSUS — página inicial"
    >
      SENSUS
    </Link>
  );
}

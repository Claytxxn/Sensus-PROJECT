import type { LucideIcon } from "lucide-react";

/**
 * Placeholder visual para as fotos dos mockups.
 * Substitua por <Image src="/imagens/..."/> quando houver fotos reais em /public.
 */
export default function Illustration({
  icon: Icon,
  label,
  className = "",
  tone = "sensus",
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  tone?: "sensus" | "sand" | "sky";
}) {
  const tones = {
    sensus: "from-sensus-100 via-cream to-sand-100 text-sensus-700",
    sand: "from-sand-100 via-cream to-sensus-50 text-sand-700",
    sky: "from-sky-soft via-cream to-sensus-100 text-sensus-700",
  };
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br shadow-[0_20px_50px_-20px_rgba(11,79,108,0.35)] ${tones[tone]} ${className}`}
    >
      <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/40" />
      <div className="absolute -bottom-16 -left-8 size-56 rounded-full bg-white/30" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8">
        <Icon className="size-16 opacity-80" strokeWidth={1.25} />
        <span className="text-center text-sm font-medium tracking-wide opacity-70">{label}</span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visivel ? "text" : "password"} className={`input pr-12 ${invalid ? "input-error" : ""}`} />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-soft hover:text-sensus-700"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
      >
        {visivel ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

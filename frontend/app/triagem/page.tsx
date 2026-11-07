import type { Metadata } from "next";
import { Suspense } from "react";
import TriagemForm from "@/components/TriagemForm";

export const metadata: Metadata = { title: "Triagem" };

export default function TriagemPage() {
  return (
    <div className="container-sensus py-14 sm:py-20">
      <Suspense fallback={<div className="card mx-auto h-[600px] max-w-3xl animate-pulse" />}>
        <TriagemForm />
      </Suspense>
    </div>
  );
}

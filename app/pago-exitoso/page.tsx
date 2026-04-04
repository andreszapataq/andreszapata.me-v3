"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

function AnimatedCheck() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
  }, []);

  return (
    <svg
      className="w-20 h-20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={ready ? "animate-draw-circle" : ""}
        style={{
          strokeDasharray: 63,
          strokeDashoffset: 63,
        }}
      />
      <path
        d="m9 12 2 2 4-4"
        className={ready ? "animate-draw-check" : ""}
        style={{
          strokeDasharray: 12,
          strokeDashoffset: 12,
        }}
      />
    </svg>
  );
}

function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    colors: ["#0d9488", "#14b8a6", "#2dd4bf", "#22c55e", "#a3a3a3"],
  };

  confetti({ ...defaults, particleCount: 50, origin: { x: 0.2, y: 0.5 } });
  confetti({ ...defaults, particleCount: 50, origin: { x: 0.8, y: 0.5 } });

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.3 } });
  }, 200);
}

export default function PagoExitosoPage() {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <main className="min-h-svh flex items-center justify-center px-6">
      <div className="max-w-[480px] text-center">
        <div className="flex justify-center mb-6 text-teal-600">
          <AnimatedCheck />
        </div>

        <h1 className="text-[32px] font-bold leading-[1.15] mb-4">
          ¡Pago exitoso!
        </h1>

        <p className="text-xl text-paragraph mb-10">
          Gracias por tu confianza. Tu pago ha sido procesado correctamente.
        </p>

        <a
          href="https://andreszapata.me"
          className="inline-flex items-center gap-2 bg-teal-600 text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}

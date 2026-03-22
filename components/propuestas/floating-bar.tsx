"use client";

import { Printer, ArrowRight } from "lucide-react";

interface FloatingBarProps {
  calendarUrl: string;
}

export default function FloatingBar({ calendarUrl }: FloatingBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 print:hidden">
      <div className="backdrop-blur-sm bg-white/90 border-t border-gray-200">
        <div className="max-w-[840px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-paragraph hover:text-foreground transition-colors cursor-pointer"
          >
            <Printer className="w-5 h-5" />
            <span className="text-sm font-medium">Guardar PDF</span>
          </button>

          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-white rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Agendar llamada
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

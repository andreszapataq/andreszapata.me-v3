"use client";

import { Printer, ArrowRight } from "lucide-react";

interface FloatingBarProps {
  calendarUrl: string;
}

export default function FloatingBar({ calendarUrl }: FloatingBarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 print:hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur-2xl rounded-full shadow-lg border border-gray-200/60">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 text-paragraph text-sm font-medium rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Printer className="w-[18px] h-[18px]" />
          Imprimir / PDF
        </button>

        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 md:px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
        >
          Agendar llamada
          <ArrowRight className="w-4 h-4 hidden md:block transition-transform duration-300 group-hover:-rotate-45" />
        </a>
      </div>
    </div>
  );
}

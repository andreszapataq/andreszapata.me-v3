interface HighlightProps {
  children: React.ReactNode;
  tooltip: string;
}

export default function Highlight({ children, tooltip }: HighlightProps) {
  return (
    <span
      className="font-semibold cursor-help border-b border-dotted border-foreground/40 relative group"
      title={tooltip}
    >
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {tooltip}
      </span>
    </span>
  );
}


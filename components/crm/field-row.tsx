export default function FieldRow({
  label,
  children,
  align = "baseline",
}: {
  label: string;
  children: React.ReactNode;
  align?: "baseline" | "start";
}) {
  return (
    <div
      className={`grid grid-cols-[5rem_1fr] gap-x-3 py-2.5 sm:grid-cols-[5.5rem_1fr] ${
        align === "start" ? "items-start" : "items-baseline"
      }`}
    >
      <span className="crm-mono text-sm text-crm-faint">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

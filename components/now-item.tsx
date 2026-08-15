import { LucideIcon } from "lucide-react";

interface NowItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Para valores que no son contenido real: cargando o dato no disponible */
  muted?: boolean;
}

export default function NowItem({
  icon: Icon,
  label,
  value,
  muted = false,
}: NowItemProps) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-now-title text-lg font-bold">
        <Icon className="w-[18px] h-[18px]" />
        {label}
      </p>
      <p className={`text-lg${muted ? " text-now-title" : ""}`}>{value}</p>
    </div>
  );
}


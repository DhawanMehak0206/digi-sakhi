import { Cpu } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center bg-accent text-accent-foreground">
        <Cpu className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-tight">Hertech</span>
    </span>
  );
}

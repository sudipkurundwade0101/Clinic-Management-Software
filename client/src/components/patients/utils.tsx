import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const fmtDate = (v?: string) =>
  v
    ? new Date(v + "T00:00:00").toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const splitCsv = (v: string) =>
  v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg animate-in slide-in-from-bottom-2 no-print">
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </div>
  );
}

export function DetailsCard({ title, values }: { title: string; values: Record<string, string> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3">
        {Object.entries(values).map(([k, v]) => (
          <div key={k}>
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="text-sm font-medium">{v}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

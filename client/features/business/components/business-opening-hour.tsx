import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Business } from "@/data/interfaces/Business";
import { Clock } from "lucide-react";

export function BusinessOpeningHour({ business }: { business: Business }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Opening Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {business.openingHours?.weekdayText?.length ? (
          business.openingHours.weekdayText.map((t: string, idx: number) => (
            <div key={idx}>{t}</div>
          ))
        ) : (
          <div>No opening hours provided.</div>
        )}
      </CardContent>
    </Card>
  );
}

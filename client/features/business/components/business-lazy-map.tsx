import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { MapPin } from "lucide-react";
import { LazyMapObserver } from "./lazy-map-observer";
import { Business } from "@/data/interfaces/Business";
import { Recommendation } from "@/data/interfaces/Recommendation";

export function BusinessLazyMap({
  business,
}: {
  business: Business | Recommendation;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3">
          <LazyMapObserver business={business} rootMargin="400px" />
        </div>
      </CardContent>
    </Card>
  );
}

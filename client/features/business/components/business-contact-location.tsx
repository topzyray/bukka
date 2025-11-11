import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { MapPin } from "lucide-react";
import { Business } from "@/data/interfaces/Business";

export function BusinessContactLocation({ business }: { business: Business }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Address</p>
          <p>{business.location?.address ?? "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">City</p>
          <p>
            {business.location?.city ?? "-"}, {business.location?.state ?? "-"}
          </p>
        </div>
        {business.phoneNumber && (
          <div>
            <p className="text-muted-foreground text-xs">Phone</p>
            <p>{business.phoneNumber}</p>
          </div>
        )}
        {business.website && (
          <div>
            <p className="text-muted-foreground text-xs">Website</p>
            <Link
              href={business.website}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {business.website}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

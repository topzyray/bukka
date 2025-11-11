import {
  BukkaButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export function BusinessMenuAndServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu & Services</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This business hasn’t uploaded its menu or services yet.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <BukkaButton size="sm">Order Menu</BukkaButton>
          <BukkaButton size="sm" variant="secondary">
            Request Service
          </BukkaButton>
        </div>
      </CardContent>
    </Card>
  );
}

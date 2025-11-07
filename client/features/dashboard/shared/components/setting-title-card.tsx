export function SettingsPageTitleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

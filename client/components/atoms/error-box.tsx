import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { extractErrorMessage } from "@/utils/extract-error-utils";

interface IErrorBox {
  error?: Error | null;
  message?: string;
  containerClassName?: string;
  className?: string;
}

export default function ErrorBox({ error, message, containerClassName, className }: IErrorBox) {
  return (
    <Card className={cn("w-full rounded p-4 text-center", containerClassName)}>
      <CardContent>
        <p className={cn("text-sm text-red-600 capitalize", className)}>
          {message ?? extractErrorMessage(error)}
        </p>
      </CardContent>
    </Card>
  );
}

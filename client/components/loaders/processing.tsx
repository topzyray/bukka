import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

interface IProcessing {
  text?: string;
  className?: string;
  lightColor?: string;
  darkColor?: string;
  size?: number;
}

export function Processing({
  text,
  className,
  size,
  lightColor,
  darkColor,
}: IProcessing) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent SSR mismatch
    return null;
  }

  return (
    <section
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {text ?? "Processing"}
      <PulseLoader
        color={
          theme != "light"
            ? `${darkColor || "#01011E"}`
            : `${lightColor || "#FFFFFF"}`
        }
        loading={true}
        size={size || 10}
        data-testid="loader"
      />
    </section>
  );
}

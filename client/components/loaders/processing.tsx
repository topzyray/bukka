"use client";

import { useTheme } from "next-themes";
import { PulseLoader } from "react-spinners";

interface IProcessing {
  text?: string;
  lightColor?: string;
  darkColor?: string;
  size?: number;
}

export function Processing({ text, size, lightColor, darkColor }: IProcessing) {
  const { theme } = useTheme();

  return (
    <span className="flex items-center justify-center gap-1">
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
    </span>
  );
}

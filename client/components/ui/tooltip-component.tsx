import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ToolTipProps {
  trigger: React.ReactNode;
  message: React.ReactNode | string;
}

export default function TooltipComponent({ trigger, message }: ToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild suppressHydrationWarning>
          {trigger}
        </TooltipTrigger>
        <TooltipContent>
          <span>{message}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft, PanelRight } from "lucide-react";
import TooltipComponent from "../ui/tooltip-component";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <TooltipComponent
      trigger={
        <p onClick={toggleSidebar} className="hover:cursor-pointer">
          {open ? <PanelLeft /> : <PanelRight />}
          <span className="sr-only">Toggle Sidebar</span>
        </p>
      }
      message={open ? "Close Sidebar" : "Open Sidebar"}
    />
  );
}

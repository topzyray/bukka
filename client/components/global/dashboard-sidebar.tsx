"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { TDashboardNavigation } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";

interface DashBoardSidebarInterface {
  navItems: TDashboardNavigation;
}

export function DashBoardSidebar({ navItems }: DashBoardSidebarInterface) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { isMobile, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const normalize = (url: string) => url.replace(/\/+$/, "");

  const toggleSideBarOnMobile = () => {
    if (isMobile) toggleSidebar();
  };

  useEffect(() => {
    const activeMenu = navItems.find(
      (item) =>
        item.hasSubmenu &&
        item.submenu?.some((subItem) =>
          normalize(pathname).startsWith(normalize(subItem.url ?? ""))
        )
    );
    if (activeMenu) {
      setOpenMenu(activeMenu.title);
    }
  }, [pathname, navItems]);

  return (
    <Sidebar side="left" variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4">
            <Link href={`/dashboard/${user?.role.toLowerCase()}/overview`}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer dark:bg-white/80 dark:p-1 dark:rounded dark:backdrop-blur-2xl"
              >
                <Image
                  src="/images/bukka.png"
                  alt="Logo"
                  width={180}
                  height={38}
                  priority
                  className="w-full h-full"
                />
              </motion.div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="max-w-[11rem] w-full" />
      <SidebarContent>
        <SidebarGroupLabel>Navigations</SidebarGroupLabel>

        {navItems.map((item) => {
          const DefaultIcon = Icons.HelpCircle as React.FC<
            React.SVGProps<SVGSVGElement>
          >; // Fallback icon

          const Icon =
            (Icons[item.icon as keyof typeof Icons] as React.FC<
              React.SVGProps<SVGSVGElement>
            >) || DefaultIcon;

          const submenuIsCurrentlyActive =
            !!item.hasSubmenu &&
            item.submenu?.some((subItem) =>
              normalize(pathname).startsWith(normalize(subItem.url ?? ""))
            );

          return item.hasSubmenu && item.isSidebarNav ? (
            <Collapsible
              key={item.title}
              className="group/collapsible"
              open={openMenu === item.title}
              onOpenChange={(isOpen) => setOpenMenu(isOpen ? item.title : null)}
            >
              <SidebarGroup className="px-0 py-0">
                <SidebarGroupLabel
                  asChild
                  // className="text-text pl-0 text-sm"
                  className={cn(
                    "text-text hover:bg-sidebar-accent hover:text-sidebar-accent-foreground pl-2 text-sm",
                    submenuIsCurrentlyActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <CollapsibleTrigger className="py-5 hover:cursor-pointer">
                    <span className="flex items-center gap-x-2">
                      {Icon && <Icon className="w-4" />}
                      {item.title}
                    </span>
                    <Icons.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="mt-2 pl-2">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.submenu != undefined &&
                        item.submenu.map((submenuItem) => {
                          const DefaultIcon = Icons.ArrowRight as React.FC<
                            React.SVGProps<SVGSVGElement>
                          >;

                          const Icon =
                            DefaultIcon ||
                            (Icons[item.icon as keyof typeof Icons] as React.FC<
                              React.SVGProps<SVGSVGElement>
                            >);

                          return (
                            <SidebarMenuItem
                              key={submenuItem.title}
                              onClick={toggleSideBarOnMobile}
                            >
                              <SidebarMenuButton
                                asChild
                                isActive={normalize(pathname).startsWith(
                                  normalize(submenuItem.url ?? "")
                                )}
                                size="default"
                              >
                                <Link href={submenuItem.url}>
                                  {Icon && <Icon className="w-4" />}
                                  <span>{submenuItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : item.isSidebarNav ? (
            <SidebarGroupContent key={item.title}>
              <SidebarMenu>
                {
                  <SidebarMenuItem onClick={toggleSideBarOnMobile}>
                    <SidebarMenuButton
                      asChild
                      isActive={normalize(pathname).startsWith(
                        normalize(item.url ?? "")
                      )}
                      size="default"
                    >
                      <Link href={item.url ? item.url : "#"}>
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                }
              </SidebarMenu>
            </SidebarGroupContent>
          ) : null;
        })}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <Link href="/">
            <SidebarMenuItem className="flex items-center gap-2 overflow-hidden py-2 text-sm text-ellipsis capitalize hover:bg-accent hover:text-black rounded-lg">
              <Icons.Home />
              Homepage
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

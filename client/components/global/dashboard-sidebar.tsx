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

interface DashBoardSidebarInterface {
  navItems: TDashboardNavigation;
}

export function DashBoardSidebar({ navItems }: DashBoardSidebarInterface) {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const toggleSideBarOnMobile = () => {
    if (isMobile) toggleSidebar();
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer"
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
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
          return item.hasSubmenu && item.isSidebarNav ? (
            <Collapsible key={item.title} className="group/collapsible">
              <SidebarGroup className="">
                <SidebarGroupLabel asChild className="text-text pl-0 text-sm">
                  <CollapsibleTrigger className="py-4 hover:cursor-pointer">
                    <span className="flex items-center gap-x-2">
                      {Icon && <Icon className="w-4" />}
                      {item.title}
                    </span>
                    <Icons.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="mt-2">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.submenu != undefined &&
                        item.submenu.map((submenuItem) => {
                          // const DefaultIcon = Icons.HelpCircle as React.FC<
                          //   React.SVGProps<SVGSVGElement>
                          // >;

                          // const Icon =
                          //   (Icons[item.icon as keyof typeof Icons] as React.FC<
                          //     React.SVGProps<SVGSVGElement>
                          //   >) || DefaultIcon;

                          return (
                            <SidebarMenuItem
                              key={submenuItem.title}
                              onClick={toggleSideBarOnMobile}
                            >
                              <SidebarMenuButton
                                asChild
                                isActive={submenuItem.url.startsWith(pathname)}
                                size="lg"
                              >
                                <Link href={submenuItem.url}>
                                  {/* {Icon && <Icon className="w-4" />} */}
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
                      isActive={item.url?.startsWith(pathname)}
                      size="lg"
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
        <SidebarMenu></SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

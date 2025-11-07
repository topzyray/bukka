"use client";

import { UserRoleEnum } from "@/data/enums";
import { useCurrentUser } from "@/data/queries";
import { UserSupportTicketList } from "@/features/dashboard/user/ticket-list";
import { AdminSupportTicketList } from "@/features/dashboard/admin/ticket-list";
import { VendorSupportTicketList } from "@/features/dashboard/vendor/ticket-list";

export default function SupportTicketsPage() {
  const { data: user } = useCurrentUser();

  switch (user?.role) {
    case UserRoleEnum.ADMIN:
      return <AdminSupportTicketList />;
    case UserRoleEnum.VENDOR:
      return <VendorSupportTicketList />;
    case UserRoleEnum.USER:
      return <UserSupportTicketList />;
    default:
      return <span>NO SUPPORT TICKET PAGE</span>;
  }
}

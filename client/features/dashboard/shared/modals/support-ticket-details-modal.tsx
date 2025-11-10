"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers";
import { Loader2 } from "lucide-react";
import { TextHelper } from "@/helpers";
import { useForm } from "react-hook-form";
import { UserRoleEnum } from "@/data/enums";
import { User } from "@/data/interfaces/User";
import { extractErrorMessage } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { BukkaButton, Form, Input, Label, ScrollArea } from "@/components/ui";
import { useSupportById } from "@/data/queries/use-support-query";
import {
  useAssignTicketToTeam,
  useResolveTicket,
} from "@/data/mutations/support/use-support-ticket-mutation";
import { useInfiniteUsers } from "@/data/queries/admin/use-users-query";
import { SelectFieldCustom } from "@/components/form-ui/custom/entity-select-field";
import { SupportStatusEnum } from "@/data/enums/SupportStatusEnum";

const assigneeSchema = z.object({
  assigneeId: z.coerce
    .number({ error: "Assignee ID is required" })
    .int()
    .min(1, { message: "Assignee ID must be a positive integer" }),
});

export type AssigneeFormValues = z.infer<typeof assigneeSchema>;

interface ISupportTicketDetailsModal {
  ticketId: string;
  open?: boolean;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function SupportTicketDetailsModal({
  ticketId,
  trigger,
  open,
  onOpenChange,
}: ISupportTicketDetailsModal) {
  const [showAssignees, setShowAssignees] = useState(false);
  const [assigneeInfo, setAssigneeInfo] = useState<User | null>(null);

  const { user } = useAuth();
  const { data, isLoading, isError, error } = useSupportById({
    ticketId,
    user: user as User,
  });
  const ticket = data?.responseData;

  const statusColor: Record<
    "light" | "dark",
    Record<"SUBMITTED" | "PENDING" | "RESOLVED", string>
  > = {
    light: {
      SUBMITTED: "text-blue-600",
      PENDING: "text-orange-600",
      RESOLVED: "text-green-600",
    },
    dark: {
      SUBMITTED: "text-blue-400",
      PENDING: "text-orange-400",
      RESOLVED: "text-green-400",
    },
  };

  const { data: adminUserApiData } = useInfiniteUsers({
    enabled: user?.role === UserRoleEnum.ADMIN,
    filters: {
      role: UserRoleEnum.ADMIN,
    },
  });

  const adminsData: User[] = useMemo(
    () => adminUserApiData?.pages.flatMap((p) => p.data) ?? [],
    [adminUserApiData]
  );

  const form = useForm({
    resolver: zodResolver(assigneeSchema),
    mode: "onSubmit",
    defaultValues: {
      assigneeId: undefined,
    },
  });

  const assigneeId = form.watch("assigneeId");

  useEffect(() => {
    if (assigneeId !== undefined) {
      const selectedAdmin = adminsData.find((admin) => admin.id === assigneeId);
      if (selectedAdmin) setAssigneeInfo(selectedAdmin);
    }
  }, [adminsData, assigneeId]);

  const resolveTicketMutation = useResolveTicket({
    onSuccess: () => {
      onOpenChange?.(!open);
    },
  });
  const assignTicketMutation = useAssignTicketToTeam({
    onSuccess: () => {
      onOpenChange?.(!open);
      setShowAssignees(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription>
            View all information related to this support ticket.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Loading Ticket Data...
            </span>
          </div>
        ) : ticket ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Ticket ID</p>
                <p className="font-medium">{ticket?.ticketId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="font-medium">{ticket?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium break-all">{ticket?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Subject</p>
                <p className="font-medium">{ticket?.subject}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Message</p>
                <p className="font-medium whitespace-pre-line leading-relaxed">
                  {ticket?.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p
                    className={cn(
                      statusColor.light[ticket.status],
                      `dark:${statusColor.dark[ticket.status]}`,
                      "font-bold"
                    )}
                  >
                    {ticket?.status}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Assigned To</p>
                  <p className="font-medium">
                    {ticket?.assignee
                      ? `${ticket?.assignee?.firstName} ${ticket?.assignee?.lastName}`
                      : "Unassigned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Created At</p>
                  <p className="font-medium">
                    {TextHelper.getFormattedDate(ticket?.createdAt as string) +
                      ", " +
                      TextHelper.getFormattedTime(ticket?.createdAt as string)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Resolved At</p>
                  <p className="font-medium">
                    {ticket?.resolvedAt
                      ? TextHelper.getFormattedDate(
                          ticket?.resolvedAt as string
                        ) +
                        ", " +
                        TextHelper.getFormattedTime(
                          ticket?.resolvedAt as string
                        )
                      : "Not resolved"}
                  </p>
                </div>
              </div>

              {showAssignees && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <Label>Assignee Details</Label>
                    </div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(
                          (data: AssigneeFormValues) => {
                            assignTicketMutation.mutate({
                              supportId: ticket?.id,
                              assigneeId: data.assigneeId,
                            });
                          }
                        )}
                        className="space-y-4"
                      >
                        <SelectFieldCustom
                          control={form.control}
                          formName="assigneeId"
                          formLabel="Admin's Email"
                          formData={adminsData ?? []}
                          placeholder="Select admin"
                          valueKey="id"
                          labelKey="email"
                          disabled={assignTicketMutation.isPending}
                        />

                        <div className="space-y-2">
                          <Label>Admin&apos;s Full Name</Label>
                          <Input
                            type="text"
                            name="fullName"
                            value={
                              assigneeInfo
                                ? `${assigneeInfo.firstName} ${assigneeInfo.lastName}`
                                : ""
                            }
                            className="focus:border-none text-sm placeholder:text-sm"
                            readOnly
                            disabled={assignTicketMutation.isPending}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <BukkaButton
                            className="flex-1"
                            variant="glow"
                            disabled={
                              !form.formState.isValid ||
                              assignTicketMutation.isPending
                            }
                          >
                            {assignTicketMutation.isPending ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" />
                                Assigning {assigneeInfo?.firstName}
                              </span>
                            ) : (
                              `Assign ${assigneeInfo?.firstName ?? ""}`
                            )}
                          </BukkaButton>

                          <BukkaButton
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAssigneeInfo(null);
                              form.reset();
                            }}
                          >
                            Reset
                          </BukkaButton>
                        </div>
                      </form>
                    </Form>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : isError ? (
          <p className="text-destructive">{extractErrorMessage(error)}</p>
        ) : (
          "Ticket data not found!"
        )}

        <Separator />

        <DialogFooter className="flex-col sm:flex-row">
          {user?.role === UserRoleEnum.ADMIN && (
            <div className="w-full flex gap-2">
              {!showAssignees && !ticket?.assignee && (
                <BukkaButton
                  type="button"
                  className="flex-1"
                  variant="glow"
                  onClick={() => {
                    setShowAssignees(true);
                  }}
                >
                  Assign
                </BukkaButton>
              )}

              {ticket?.status !== SupportStatusEnum.RESOLVED && (
                <BukkaButton
                  className="flex-1"
                  type="button"
                  variant="glow"
                  disabled={
                    resolveTicketMutation.isPending ||
                    ticket?.status !== SupportStatusEnum.PENDING
                  }
                  onClick={() => {
                    resolveTicketMutation.mutate({
                      supportId: ticket?.id as number,
                    });
                  }}
                >
                  {resolveTicketMutation?.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Resolving
                    </span>
                  ) : (
                    "Resolve"
                  )}
                </BukkaButton>
              )}
            </div>
          )}
          <DialogClose asChild>
            <BukkaButton variant="secondary">Close</BukkaButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

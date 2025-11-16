"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useState, useTransition } from "react";
import { useDeleteMyAccount } from "@/data/mutations/user/use-delete-account";

export function AccountDeletionCard() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const deleteAccountMutation = useDeleteMyAccount();

  async function handleDeleteAccount() {
    startTransition(async () => {
      deleteAccountMutation.mutate();
    });
  }

  const busy = isPending || deleteAccountMutation.isPending;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <div
              className="flex justify-self-end"
              onClick={(e) => e.stopPropagation()}
            >
              <Button type="button" variant="destructive" disabled={isPending}>
                Delete My Account
              </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete your account, all reviews,
                favorites, and business listings associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  disabled={busy}
                  onClick={handleDeleteAccount}
                  className="bg-destructive dark:bg-destructive"
                >
                  {busy ? "Deleting..." : "Yes, Delete My Account"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

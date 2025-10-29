"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateBusinessCategoryModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // Example API call (adjust the endpoint)
      const res = await fetch("/api/admin/business-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create business category");

      toast.success("Business category created successfully!");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-glow">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Business Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-2xl shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Create New Business Category
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define a new category that vendors can assign their businesses to.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2 text-left">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g. Restaurants"
              {...form.register("name")}
              className="rounded-lg"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="e.g. restaurants"
              {...form.register("slug")}
              className="rounded-lg"
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive">
                {form.formState.errors.slug.message}
              </p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the category..."
              {...form.register("description")}
              className="rounded-lg min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 shadow-elegant"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

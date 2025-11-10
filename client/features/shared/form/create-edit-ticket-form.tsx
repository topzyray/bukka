"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User } from "@/data/interfaces/User";
import { Support } from "@/data/interfaces/Support";
import { zodResolver } from "@hookform/resolvers/zod";
import { BukkaButton, DialogFooter, Form } from "@/components/ui";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { useCreateTicket } from "@/data/mutations/support/use-support-ticket-mutation";
import { AtSign, Captions, Loader2, TextCursor, UserIcon } from "lucide-react";
import { TextAreaComponent } from "@/components/form-ui/base/text-area-component";
import { UserRoleEnum } from "@/data/enums";

const contactUsSchema = z.object({
  name: z.string().min(2, "Name must be at least 3 characters"),
  subject: z.string().min(2, "Subject must be at least 5 characters"),
  email: z.email("Email must be valid"),
  message: z.string().min(2, "Message at least 2 characters"),
});

type ContactUsFormValues = z.infer<typeof contactUsSchema>;

interface IContactUsForm {
  isEdit: boolean;
  busy?: boolean;
  initialData?: Partial<Support>;
  user?: User | null;
  onSuccess?: () => void;
}

export function CreateEditTicketForm({
  isEdit,
  busy,
  initialData,
  user,
  onSuccess,
}: IContactUsForm) {
  const form = useForm<ContactUsFormValues>({
    resolver: zodResolver(contactUsSchema),
    mode: "onChange",
    defaultValues: {
      name: user ? `${user?.firstName} ${user?.lastName}` : "",
      email: user ? user?.email : "",
      subject: initialData ? initialData?.subject : "",
      message: initialData ? initialData?.message : "",
    },
  });

  const { mutate: createTicket, isPending } = useCreateTicket({
    onSuccess: () => {
      onSuccess?.();
      form.reset();
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.firstName + " " + user?.lastName,
        email: user?.email,
      });
    }

    if (initialData && user) {
      form.reset({
        name: user?.firstName + " " + user?.lastName,
        email: user?.email,
        subject: initialData?.subject,
        message: initialData?.message,
      });
    }
  }, [form, user, initialData]);

  const onSubmit = (data: ContactUsFormValues) => {
    createTicket(data);
  };

  busy = busy || isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-0.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputComponent
            formControl={form.control}
            formName="name"
            formLabel="Name *"
            formInputType="text"
            formPlaceholder="Enter your full name"
            icon={UserIcon}
            disabled={busy}
            readOnly={!!user || isEdit}
          />

          <InputComponent
            formControl={form.control}
            formName="email"
            formLabel="Email"
            formInputType="email"
            formPlaceholder="Enter valid email"
            icon={AtSign}
            disabled={busy}
            readOnly={!!user || isEdit}
          />
        </div>

        <InputComponent
          formControl={form.control}
          formName="subject"
          formLabel="Subject *"
          formInputType="text"
          formPlaceholder="Enter title of ticket"
          icon={Captions}
          disabled={busy}
          readOnly={isEdit}
        />

        <TextAreaComponent
          formControl={form.control}
          formName="message"
          formPlaceholder="Enter details of ticket"
          formLabel="Details"
          rows={6}
          icon={TextCursor}
          formDescription={
            isEdit ? "" : "Fill details of request, enquiry or challenges"
          }
          disabled={busy}
          readOnly={isEdit}
        />

        <DialogFooter>
          <div className="flex gap-2 w-full">
            {isEdit && user?.role === UserRoleEnum.ADMIN && (
              <div className="w-full flex flex-wrap gap-2">
                <BukkaButton
                  type="button"
                  variant="glow"
                  className="flex-1"
                  disabled={busy || !form.formState.isValid}
                >
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Processing
                    </span>
                  ) : (
                    "Assign"
                  )}
                </BukkaButton>
                <BukkaButton
                  type="button"
                  variant="glow"
                  className="flex-1"
                  disabled={busy || !form.formState.isValid}
                >
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Processing
                    </span>
                  ) : (
                    "Mark as Resolved"
                  )}
                </BukkaButton>
              </div>
            )}
            {!isEdit && (
              <BukkaButton
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={busy || !form.formState.isValid}
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Processing
                  </span>
                ) : (
                  "Send Message"
                )}
              </BukkaButton>
            )}
            {!isEdit && (
              <BukkaButton
                variant="ghost"
                onClick={() => form.reset()}
                type="button"
                disabled={busy}
              >
                Reset
              </BukkaButton>
            )}
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

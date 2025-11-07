import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
} from "@/components/ui";
import { useChangePassword } from "@/data/mutations/auth/use-change-password";
import { InputComponent } from "@/components/form-ui/base/input-component";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password cannot be less than 8 characters"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function PasswordUpdateForm() {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "all",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const {
    mutate: processChangePassword,
    isPending: isProcessingPasswordChange,
  } = useChangePassword({ resetForm: form.reset });

  const onSubmit = async (data: ChangePasswordFormData) => {
    processChangePassword(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Password Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputComponent
              formControl={form.control}
              formName="currentPassword"
              formInputType="password"
              formLabel="Current Password"
              disabled={isProcessingPasswordChange}
              isPassword
            />

            <InputComponent
              formControl={form.control}
              formName="newPassword"
              formInputType="password"
              formLabel="New Password"
              disabled={isProcessingPasswordChange}
              showPasswordStrength={true}
              isPassword
            />

            <div className="flex justify-end">
              <Button
                disabled={!form.formState.isValid || isProcessingPasswordChange}
                type="submit"
              >
                {isProcessingPasswordChange ? "Updating" : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

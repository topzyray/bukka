"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investorDetailsSchema } from "@/data/schemas/onboarding";
import { useOnboarding } from "@/providers/onboarding-provider";
import { InputComponent } from "@/components/form-ui/base/input-component";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export default function InvestorDetailsStep({ onNext, onBack, finalize }: any) {
  const { state, actions } = useOnboarding();
  const form = useForm({
    resolver: zodResolver(investorDetailsSchema),
    defaultValues: state.roleSpecific ?? undefined,
    mode: "all",
  });

  const submit = (data: any) => {
    actions.setRoleSpecific(data);
    if (finalize) finalize();
    else onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <InputComponent
          formControl={form.control}
          formName="investmentExperienceYears"
          formInputType="number"
          formPlaceholder="Years of experience"
        />
        <InputComponent
          formControl={form.control}
          formName="primaryInvestmentType"
          formInputType="text"
          formPlaceholder="Primary investment type"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="acc"
            onChange={(e) =>
              form.setValue("accreditedInvestor", e.target.checked)
            }
            defaultChecked={form.getValues("accreditedInvestor")}
          />
          <label htmlFor="acc">Accredited investor</label>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Finish</Button>
        </div>
      </form>
    </Form>
  );
}

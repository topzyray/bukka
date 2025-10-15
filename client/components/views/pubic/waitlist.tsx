"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  PhoneCallIcon,
  User,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Form } from "../../ui/form";
import { WaitlistApiService } from "@/server/services/WaitlistApiService";
import { useCustomMutation } from "@/server/mutations/base";
import { InputComponent } from "../../forms/base/input-component";
import { PhoneNumberInput } from "../../forms/base/phone-number-component";
import parsePhoneNumberFromString from "libphonenumber-js";
import ContactSection from "../../atoms/contact-section";
import { TypeAnimation } from "react-type-animation";
import { Processing } from "../../loaders/processing";
import { useCustomQuery } from "@/server/queries/base";
import { useQueryClient } from "@tanstack/react-query";
import { CircleLoader } from "react-spinners";
import { ThemeToggle } from "@/components/atoms/mode-toggle";

const phoneNumberSchema = z
  .string()
  .nonempty("Phone number is required")
  .refine(
    (val) => {
      if (!val.startsWith("+")) return false; // enforce leading +
      const phoneNumber = parsePhoneNumberFromString(val);
      return phoneNumber?.isValid() || false;
    },
    {
      message: "Please enter a valid international phone number",
    }
  );

const joinWaitlistSchema = z.object({
  name: z
    .string({ error: "Please enter a valid string" })
    .min(3, { error: "Please enter your full name" }),
  email: z.email({ message: "Please enter a valid email address" }),
  phoneNumber: phoneNumberSchema,
});

type ForgotPasswordFormData = z.infer<typeof joinWaitlistSchema>;

export default function BukkaWaitList() {
  const [success, setSuccess] = useState(false);
  const [contact, showContact] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useCustomQuery(["waitlistCount"], () =>
    WaitlistApiService.getWaitlistCount()
  );

  const form = useForm<ForgotPasswordFormData>({
    mode: "all",
    resolver: zodResolver(joinWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { mutate: addUserToWaitlist, isPending: addingUserToWaitlist } =
    useCustomMutation(WaitlistApiService.joinWaitlist, {
      onSuccessCallback: () => {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["waitlistCount"] });
      },
    });

  async function onSubmit(data: z.infer<typeof joinWaitlistSchema>) {
    addUserToWaitlist(data);
  }

  const toggleModal = () => showContact(!contact);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-subtle overflow-hidden px-6 py-10 text-center">
      <section className="absolute right-2 top-2">
        <ThemeToggle />
      </section>

      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full animate-pulse-glow" />
      </div>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl space-y-4"
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-24 flex items-center justify-center mx-auto hover:cursor-pointer dark:bg-white/80 dark:p-2 dark:rounded dark:backdrop-blur-2xl"
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
        <h1 className="text-4xl md:text-5xl font-bold leading-tight sm:text-6xl text-shine">
          Discover Nigeria’s Finest{" "}
          <TypeAnimation
            sequence={[
              "Tasty Meals",
              1000,
              "Nice Bar",
              1000,
              "Restaurants",
              1000,
              "Confectionaries",
              1000,
              "Super Bukka",
              1000,
              "Sharwama",
              1000,
              "Eatries",
              1000,
              "Mama Put",
              1000,
            ]}
            wrapper="span"
            className="text-accent"
            repeat={Infinity}
          />{" "}
          <br />
          nearby with <span className="text-primary">Bukka</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          We’re redefining how Nigerians find, order, and enjoy local
          delicacies. Join our exclusive waiting list and be first to experience
          the future of food discovery powered by modern technologies and AI.
        </p>

        {/* Waitlist form */}
        <section className="flex flex-col gap-3 max-w-sm w-full mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <InputComponent
                formControl={form.control}
                formName="name"
                formInputType="text"
                formPlaceholder="Your full name"
                disabled={addingUserToWaitlist}
                icon={User}
              />

              <InputComponent
                formControl={form.control}
                formName="email"
                formInputType="email"
                formPlaceholder="Enter valid email"
                disabled={addingUserToWaitlist}
                icon={Mail}
              />

              <PhoneNumberInput
                formControl={form}
                formName="phoneNumber"
                autoDetect={true}
                disabled={addingUserToWaitlist}
                icon={Phone}
              />

              {/* <LocationInput
                formControl={form}
                formName="address"
                handlePlaceSelect={FormInputHelper.handlePlaceSelect}
                autoDetect={true}
                disabled={addingUserToWaitlist}
                icon={MapPin}
              /> */}

              <Button
                type="submit"
                size="lg"
                disabled={
                  addingUserToWaitlist || success || !form.formState.isValid
                }
                className="warm-gradient text-white font-semibold px-6 py-3 rounded-lg shadow-elegant hover-glow cursor-pointer"
              >
                {success ? (
                  "You're on the list! 🎉"
                ) : addingUserToWaitlist ? (
                  <Processing text="Joining" />
                ) : (
                  "Join the Waitlist"
                )}
              </Button>
            </form>
          </Form>
        </section>
        {/* Subtext */}
        <div className="flex justify-center gap-4 text-muted-foreground mt-6 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} /> Available soon in Abuja, Lagos & more
          </div>
          <div className="flex items-center gap-1">
            <Utensils size={16} /> Over{" "}
            {isLoading ? (
              <CircleLoader size={15} color="#462009" />
            ) : data ? (
              data?.responseData?.totalWaitlist
            ) : isError ? (
              "0"
            ) : null}
            + food lovers waiting
          </div>
        </div>
      </motion.div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-14 text-center"
      >
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Be the first to get access
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Early members get exclusive invites, rewards, discounted deliveries at
          launch and lot more.
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="w-full mt-16 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Bukka. All rights reserved.
      </footer>

      <motion.section
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-6xl opacity-50"
      >
        🍽️
      </motion.section>
      <motion.section
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-10 text-5xl opacity-30"
      >
        🍕
      </motion.section>
      <motion.section
        animate={{ x: [0, 20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-20 text-4xl opacity-30"
      >
        🍜
      </motion.section>

      <motion.section
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="cursor-pointer absolute bottom-0 right-0 opacity-50 border border-primary p-2 rounded-full"
        onClick={toggleModal}
      >
        <PhoneCallIcon />
      </motion.section>

      {contact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-60 "
          onClick={toggleModal} // close when clicking overlay
        >
          {/* Modal Content */}
          <div
            className="bg-white/60 backdrop-blur-md rounded-lg p-6 w-11/12 max-w-md text-primary"
            onClick={(e) => e.stopPropagation()} // prevent closing on content click
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Get in Touch Today</h2>
              <button
                onClick={toggleModal}
                className="text-2xl font-bold hover:text-amber-400"
              >
                &times;
              </button>
            </div>
            <ContactSection />
          </div>
        </div>
      )}
    </main>
  );
}

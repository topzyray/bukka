"use client";

import { useAuth } from "@/providers";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Header } from "../../../components/layouts/header";
import { Footer } from "../../../components/layouts/footer";
import { CreateEditTicketForm } from "@/features/shared/form/create-edit-ticket-form";

export default function Contact() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-shine mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We&apos;d love to hear from you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll respond within 24
                    hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateEditTicketForm isEdit={false} user={user ?? null} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    hello.bukka@proton.me
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    +234 (703) 552-7946
                  </p>
                </CardContent>
              </Card>

              {/* <Card className="shadow-card">
                <CardContent className="p-6">
                  <MapPin className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Food Street
                    <br />
                    Lagos, Nigeria
                  </p>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

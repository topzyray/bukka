"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "../../../components/layouts/Header";
import { Footer } from "../../../components/layouts/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-shine mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Bukka, you accept and agree to be bound
                by the terms and provisions of this agreement.
              </p>

              <h2>2. Use of Service</h2>
              <p>
                You agree to use the service only for lawful purposes and in
                accordance with these Terms. You agree not to use the service:
              </p>
              <ul>
                <li>
                  In any way that violates any applicable law or regulation
                </li>
                <li>
                  To transmit any unauthorized advertising or promotional
                  material
                </li>
                <li>
                  To impersonate or attempt to impersonate another user or
                  person
                </li>
                <li>
                  To engage in any conduct that restricts or inhibits
                  anyone&apos;s use of the service
                </li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>
                When you create an account, you must provide accurate and
                complete information. You are responsible for maintaining the
                confidentiality of your account credentials.
              </p>

              <h2>4. User Content</h2>
              <p>
                You retain rights to any content you submit to the service. By
                posting content, you grant us a license to use, modify, and
                display that content in connection with the service.
              </p>

              <h2>5. Restaurant Listings</h2>
              <p>
                Restaurant information is provided for informational purposes
                only. We strive to provide accurate information but cannot
                guarantee its completeness or accuracy.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The service and its original content, features, and
                functionality are owned by Bukka and are protected by
                international copyright and trademark laws.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                Bukka shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of
                the service.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes by posting the new Terms of
                Service on this page.
              </p>

              <h2>9. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at
                legal@bukka.com.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "../../../components/layouts/Header";
import { Footer } from "../../../components/layouts/Footer";

const Privacy = () => {
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
            <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-shine mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-8 prose prose-lg max-w-none">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including
                name, email address, location data, and preferences when you
                create an account or use our services.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Personalize your experience on our platform</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy or as required by law.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the Internet is 100% secure.
              </p>

              <h2>5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal
                information at any time. Contact us if you wish to exercise
                these rights.
              </p>

              <h2>6. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information to improve
                user experience.
              </p>

              <h2>7. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this
                page.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have questions about this privacy policy, please contact
                us at privacy@bukka.com.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

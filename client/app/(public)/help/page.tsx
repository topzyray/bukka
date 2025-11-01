"use client";

import { motion } from "framer-motion";
import { Search, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "../../../components/layouts/header";
import { Footer } from "../../../components/layouts/footer";

const Help = () => {
  const faqs = [
    {
      question: "How do I search for restaurants?",
      answer:
        "Use the search bar at the top of any page to search by restaurant name, cuisine type, or location. You can also use filters to narrow down results by rating, price, and distance.",
    },
    {
      question: "How do I save my favorite restaurants?",
      answer:
        "Click the heart icon on any restaurant card to add it to your favorites. You can access all your saved restaurants from the Favorites page.",
    },
    {
      question: "Can I submit a restaurant that's not listed?",
      answer:
        'Yes! Click on "Add Your Restaurant" in the footer and fill out the form. Our team will review and add it to the platform within 2-3 business days.',
    },
    {
      question: "How are restaurants rated?",
      answer:
        "Restaurants are rated based on user reviews and ratings. Our algorithm takes into account multiple factors including food quality, service, ambiance, and value for money.",
    },
    {
      question: "Is Bukka available in my area?",
      answer:
        "We're constantly expanding to new cities. Check the map view to see available restaurants in your area. If we're not in your city yet, sign up for updates!",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach us through the Contact page, via email at hello.bukka@proton.me, or call us at +1 (555) 123-4567. We typically respond within 24 hours.",
    },
  ];

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
            <HelpCircle className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-shine mb-4">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions
            </p>
          </div>

          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle>Search Help Articles</CardTitle>
              <CardDescription>
                Type your question to find quick answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search for help..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Browse through our most common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;

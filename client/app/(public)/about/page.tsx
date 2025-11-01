"use client";

import { motion } from "framer-motion";
import { Target, Users, Award, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "../../../components/layouts/header";
import { Footer } from "../../../components/layouts/footer";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To connect food lovers with the best local restaurants and culinary experiences.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building a vibrant community of food enthusiasts and restaurant owners.",
    },
    {
      icon: Award,
      title: "Quality Standards",
      description:
        "Ensuring every restaurant meets our high standards for quality and service.",
    },
    {
      icon: Heart,
      title: "Passion for Food",
      description:
        "Driven by our love for great food and memorable dining experiences.",
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
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-shine">
              About Bukka
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion for discovering amazing restaurants and
              culinary adventures
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bukka was founded with a simple mission: to help people discover
              and enjoy great food. We believe that every meal is an opportunity
              for a memorable experience, and we&apos;re here to guide you to
              the best restaurants in your area.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform connects food lovers with local restaurants, making
              it easy to explore new cuisines, find hidden gems, and support
              local businesses. Whether you&apos;re looking for a quick bite or
              a special dining experience, Bukka is your trusted guide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="shadow-card hover-lift h-full">
                  <CardContent className="p-6">
                    <value.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="shadow-card bg-gradient-subtle">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you&apos;re a food lover or a restaurant owner, we
                invite you to be part of our growing community. Together,
                we&apos;re building the ultimate food discovery platform.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Header } from "../../../components/layouts/Header";
import { Footer } from "../../../components/layouts/Footer";

const Categories = () => {
  const router = useRouter();

  const categories = [
    { name: "African", emoji: "🌍", count: 234 },
    { name: "Asian", emoji: "🍜", count: 189 },
    { name: "Italian", emoji: "🍝", count: 156 },
    { name: "American", emoji: "🍔", count: 198 },
    { name: "Mexican", emoji: "🌮", count: 143 },
    { name: "Middle Eastern", emoji: "🥙", count: 87 },
    { name: "Mediterranean", emoji: "🥗", count: 112 },
    { name: "Indian", emoji: "🍛", count: 167 },
    { name: "Japanese", emoji: "🍱", count: 134 },
    { name: "Chinese", emoji: "🥢", count: 201 },
    { name: "French", emoji: "🥐", count: 78 },
    { name: "Thai", emoji: "🍲", count: 92 },
    { name: "Desserts", emoji: "🍰", count: 156 },
    { name: "Seafood", emoji: "🦞", count: 89 },
    { name: "Vegetarian", emoji: "🥬", count: 167 },
    { name: "Fast Food", emoji: "🍟", count: 223 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-shine mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore restaurants by your favorite cuisine type
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card
                  className="shadow-card hover-lift cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/search?category=${category.name.toLowerCase()}`
                    )
                  }
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{category.emoji}</div>
                    <h3 className="font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} restaurants
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;

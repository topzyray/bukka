"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Upload, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BukkaButton } from "@/components/ui/button-variants";
import { toast } from "sonner";
import { Header } from "../../../layouts/header";
import { Footer } from "../../../layouts/footer";

export const AddBusiness = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    description: "",
    cuisine: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Restaurant Submitted!", {
      description:
        "We'll review your submission and add it to our platform soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl">Add Your Restaurant</CardTitle>
              <CardDescription>
                Help others discover amazing food by adding your restaurant to
                Bukka
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                    <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <Input
                    id="cuisine"
                    placeholder="e.g., Nigerian, Italian, Chinese"
                    value={formData.cuisine}
                    onChange={(e) =>
                      setFormData({ ...formData, cuisine: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tell us about your restaurant..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop photos
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg flex gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      Submission Guidelines
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure all information is accurate and up-to-date</li>
                      <li>
                        Upload clear, high-quality photos of your restaurant
                      </li>
                      <li>
                        Our team will review your submission within 2-3 business
                        days
                      </li>
                    </ul>
                  </div>
                </div>

                <BukkaButton type="submit" size="lg" className="w-full">
                  Submit Restaurant
                </BukkaButton>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

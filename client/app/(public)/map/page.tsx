"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { List, Filter } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import MapWrapper from "@/components/map/MapWrapper";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { Header } from "../../../components/layouts/Header";

const Map = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  // Mock restaurant markers
  const mockMarkers = [
    {
      id: "1",
      coordinates: [-3.435973, 55.378051] as [number, number],
      name: "Mama Cass",
      address: "123 Royal Mile, Edinburgh",
    },
    {
      id: "2",
      coordinates: [-3.445973, 55.368051] as [number, number],
      name: "Spice Garden",
      address: "456 Princes Street, Edinburgh",
    },
    {
      id: "3",
      coordinates: [-3.425973, 55.388051] as [number, number],
      name: "The Burger Joint",
      address: "789 Grassmarket, Edinburgh",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Map Area */}
          <div className="flex-1 relative">
            <MapWrapper
              markers={mockMarkers}
              onLocationSelect={setSelectedLocation}
              className="w-full h-full"
            />

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <FilterDialog>
                <BukkaButton
                  variant="outline"
                  size="icon"
                  className="bg-background/95 backdrop-blur-sm"
                >
                  <Filter className="w-4 h-4" />
                </BukkaButton>
              </FilterDialog>
              <BukkaButton
                variant="outline"
                size="icon"
                className="bg-background/95 backdrop-blur-sm md:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <List className="w-4 h-4" />
              </BukkaButton>
            </div>

            {selectedLocation && (
              <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 text-sm">
                <div className="text-muted-foreground">
                  Selected: {selectedLocation[1].toFixed(6)},{" "}
                  {selectedLocation[0].toFixed(6)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: showSidebar ? 0 : 400 }}
            transition={{ duration: 0.5 }}
            className={`${
              showSidebar ? "block" : "hidden"
            } md:block w-96 bg-background border-l`}
          >
            <div className="overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Nearby Restaurants</h2>
                  <span className="text-sm text-muted-foreground">
                    24 found
                  </span>
                </div>

                {/* Restaurant Cards */}
                {mockMarkers.map((marker, i) => (
                  <Card key={marker.id} className="hover-lift cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {marker.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Nigerian Cuisine
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {marker.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium">
                              4.{5 + i}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-sm text-muted-foreground">
                              0.{i + 1} km
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Map;

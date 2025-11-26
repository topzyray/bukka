const CUINES = [
  {
    cuisine: "Italian",
    dishes: [
      "Spaghetti Bolognese",
      "Lasagna",
      "Pizza Margherita",
      "Risotto",
      "Tiramisu",
    ],
  },
  {
    cuisine: "Japanese",
    dishes: ["Sushi", "Ramen", "Tempura", "Gyoza", "Miso Soup"],
  },
  {
    cuisine: "Indian",
    dishes: [
      "Butter Chicken",
      "Vindaloo",
      "Biryani",
      "Samosas",
      "Naan Bread",
      "Masala Dosa",
    ],
  },
  {
    cuisine: "Chinese",
    dishes: [
      "Fried Rice",
      "Peking Duck",
      "Chow Mein",
      "Dim Sum",
      "Kung Pao Chicken",
    ],
  },
  {
    cuisine: "Mexican",
    dishes: [
      "Tacos Al Pastor",
      "Ceviche",
      "Enchiladas",
      "Guacamole",
      "Chiles en Nogada",
    ],
  },
  {
    cuisine: "French",
    dishes: [
      "Coq au Vin",
      "Boeuf Bourguignon",
      "Macarons",
      "Bouillabaisse",
      "Quiche Lorraine",
    ],
  },
  {
    cuisine: "Thai",
    dishes: [
      "Pad Thai",
      "Green Curry",
      "Tom Yum Soup",
      "Massaman Curry",
      "Mango Sticky Rice",
    ],
  },
  {
    cuisine: "Middle Eastern",
    dishes: [
      "Hummus with Pita Bread",
      "Falafel",
      "Shawarma",
      "Kebabs",
      "Tabbouleh",
    ],
  },
  {
    cuisine: "Spanish",
    dishes: [
      "Paella",
      "Tapas",
      "Gazpacho",
      "Tortilla Española",
      "Jamon Iberico",
    ],
  },
  {
    cuisine: "Greek",
    dishes: ["Moussaka", "Souvlaki", "Greek Salad", "Tzatziki", "Spanakopita"],
  },
  {
    cuisine: "American",
    dishes: [
      "Hamburger",
      "Hot Dog",
      "Macaroni and Cheese",
      "Apple Pie",
      "New York-style Pizza",
    ],
  },
  {
    cuisine: "Vietnamese",
    dishes: [
      "Pho",
      "Banh Mi",
      "Spring Rolls (Goi Cuon)",
      "Bun Cha",
      "Vietnamese Iced Coffee",
    ],
  },
  {
    cuisine: "Ethiopian",
    dishes: ["Injera", "Doro Wat", "Tibs", "Misir Wat (Lentil Stew)"],
  },
  {
    cuisine: "Turkish",
    dishes: ["Kebabs", "Baklava", "Meze", "Turkish Delight (Lokum)", "Menemen"],
  },
  {
    cuisine: "Korean",
    dishes: ["Kimchi", "Bibimbap", "Korean BBQ", "Bulgogi", "Tteokbokki"],
  },
  {
    cuisine: "Peruvian",
    dishes: ["Ceviche", "Lomo Saltado", "Aji de Gallina", "Pisco Sour"],
  },
  {
    cuisine: "German",
    dishes: [
      "Schnitzel",
      "Sausages (Wurst)",
      "Sauerkraut",
      "Pretzels",
      "Black Forest Cake",
    ],
  },
  {
    cuisine: "Brazilian",
    dishes: ["Feijoada", "Churrasco", "Pão de Queijo", "Açaí Bowl"],
  },
  {
    cuisine: "British",
    dishes: [
      "Fish and Chips",
      "Shepherd's Pie",
      "Full English Breakfast",
      "Roast Beef with Yorkshire Pudding",
    ],
  },
  {
    cuisine: "Malaysian",
    dishes: ["Satay", "Nasi Lemak", "Laksa", "Rendang"],
  },
  {
    cuisine: "Filipino",
    dishes: ["Adobo", "Sinigang", "Lechon", "Halo-Halo"],
  },
  {
    cuisine: "Moroccan",
    dishes: ["Tagine", "Couscous", "Pastilla", "Mint Tea"],
  },
  {
    cuisine: "Nigerian",
    dishes: ["Jollof Rice", "Suya", "Egusi Soup", "Pounded Yam with Stew"],
  },
  {
    cuisine: "Argentine",
    dishes: ["Asado (BBQ)", "Empanadas", "Dulce de Leche", "Malbec Wine"],
  },
];

export const CUISINE_OPTIONS: Record<string, string[]> = {
  African: [
    "Nigerian",
    "Ghanaian",
    "Ethiopian",
    "Moroccan",
    "South African",
    "Kenyan",
    "Egyptian",
    "Tunisian",
    "Senegalese",
    "Somali",
  ],
  American: [
    "Southern (Soul Food)",
    "Cajun & Creole",
    "Tex-Mex",
    "Hawaiian",
    "Californian Fusion",
    "Barbecue (BBQ)",
    "New England",
    "Midwestern Comfort",
    "Pacific Northwest",
  ],
  Asian: [
    "Chinese",
    "Japanese",
    "Thai",
    "Korean",
    "Vietnamese",
    "Indian",
    "Pakistani",
    "Indonesian",
    "Filipino",
    "Malaysian",
    "Sri Lankan",
    "Nepalese",
  ],
  European: [
    "Italian",
    "French",
    "Spanish",
    "Greek",
    "British",
    "German",
    "Portuguese",
    "Turkish",
    "Russian",
    "Scandinavian",
  ],
  MiddleEastern: [
    "Lebanese",
    "Persian (Iranian)",
    "Israeli",
    "Syrian",
    "Turkish",
    "Iraqi",
    "Emirati",
    "Saudi Arabian",
  ],
  LatinAmerican: [
    "Mexican",
    "Brazilian",
    "Argentinian",
    "Peruvian",
    "Colombian",
    "Cuban",
    "Puerto Rican",
    "Venezuelan",
    "Chilean",
  ],
  Caribbean: [
    "Jamaican",
    "Trinidadian",
    "Haitian",
    "Barbadian",
    "Cuban",
    "Dominican",
    "Bahamas",
  ],
  Oceanian: ["Australian", "New Zealand", "Polynesian", "Fijian", "Samoan"],
  FusionModern: [
    "Afro-Fusion",
    "Asian-Fusion",
    "Tex-Mex Fusion",
    "Plant-Based",
    "Vegan Fusion",
    "Street Food",
    "Contemporary Global",
  ],
};

export const cuisineSuggestions = Object.entries(CUISINE_OPTIONS).flatMap(
  ([region, cuisines]) =>
    cuisines.map(
      (cuisine) => `${region.replace(/([A-Z])/g, " $1").trim()} - ${cuisine}`
    )
);

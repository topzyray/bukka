export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    cuisines: string[];
    priceRange: [number, number];
    radius: number;
  };
}

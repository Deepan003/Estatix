// This interface defines the data structure for a single property.
// It ensures that all property data used in the application is consistent.
export interface Property {
  _id?: string; // MongoDB automatically adds this ID.
  id: number;
  title: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  imageUrl: string;
  ecoCertified: boolean;
  type: 'sale' | 'rent';
}
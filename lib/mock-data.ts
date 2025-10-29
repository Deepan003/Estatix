// This interface defines the data structure for a single property.
// It ensures that all property data used in the application is consistent.
export interface Property {
  _id?: string; // MongoDB automatically adds this ID.
  id?: number; // This seems to be from mock data, make it optional
  title: string;
  price: number;
  address: string; // You added this field
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  imageUrl: string;
  ecoCertified: boolean;
  type: 'sale' | 'rent';
  description: string; // You added this field
  ownerEmail?: string; // You added this field
  createdAt?: Date; // You added this field
}
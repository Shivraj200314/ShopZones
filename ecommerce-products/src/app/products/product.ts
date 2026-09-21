export interface Product {

  id: number;

  title: string;

  brand: string;

  category: string;

  price: number;

  oldPrice?: number;

  rating: number;

  reviews: number;

  image?: string;

  description: string;

  stock: number;

}
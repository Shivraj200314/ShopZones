import { Product } from "./product";

export const PRODUCTS: Product[] = [

  {
    id: 1,
    title: 'iPhone 15',
    brand: 'Apple',
    category: 'Mobiles',
    price: 69999,
    oldPrice: 79999,
    rating: 4.8,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    description:
      'iPhone 15 with advanced camera, powerful performance and premium design.',
    stock: 15
  },

  {
    id: 2,
    title: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'Mobiles',
    price: 74999,
    oldPrice: 84999,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    description:
      'Samsung Galaxy S24 with powerful processor, excellent display and advanced camera.',
    stock: 12
  },

  {
    id: 3,
    title: 'MacBook Air M3',
    brand: 'Apple',
    category: 'Laptops',
    price: 109999,
    oldPrice: 119999,
    rating: 4.9,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800',
    description:
      'MacBook Air powered by Apple M3 chip with lightweight premium design.',
    stock: 8
  },

  {
    id: 4,
    title: 'Dell XPS 15',
    brand: 'Dell',
    category: 'Laptops',
    price: 124999,
    oldPrice: 139999,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    description:
      'Dell XPS laptop with high performance and premium display.',
    stock: 7
  },

  {
    id: 5,
    title: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Headphones',
    price: 29999,
    oldPrice: 34999,
    rating: 4.8,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    description:
      'Premium wireless headphones with industry-leading noise cancellation.',
    stock: 20
  },

  {
    id: 6,
    title: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'Smart Watches',
    price: 41999,
    oldPrice: 45999,
    rating: 4.7,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800',
    description:
      'Apple Watch with health, fitness and smart connectivity features.',
    stock: 10
  }

];
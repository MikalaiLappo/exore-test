/**
 * Product Data from API
 */
export type ProductData = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
};

export type ProductRating = {
  rate: number;
  count: number;
};

export type ProductStatus = 'Live' | 'Draft';
export type ProductSource = 'API' | 'Local';

export type Product = ProductData & {
  status: ProductStatus;
  source: ProductSource;
  createdAt: number;
  updatedAt: number;
};
export type NewProduct = Omit<Product, 'id' | 'rating'>;

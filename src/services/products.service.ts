/* eslint-disable import/extensions */
import axios from 'axios';
import { ProductData, ProductId } from '@/types/products.js';

const BASE_URL = 'https://fakestoreapi.com/';
const makeUrl = (s: string) => `${BASE_URL}${s}`;

class ProductsService {
  static async fetchProducts(limit: number | 'all') {
    if (typeof limit === 'number' && limit < 1) {
      throw new Error('ProductsService: Invalid limit parameter');
    }
    const url = limit === 'all' ? makeUrl('products') : makeUrl(`products?limit=${limit}`);
    const resp = await axios.get(url);
    return resp.data as Promise<ProductData[]>;
  }

  static async removeProduct(id: ProductId) {
    const resp = await axios.delete(`products/${id}`);
    return resp.data;
  }
}

export default ProductsService;

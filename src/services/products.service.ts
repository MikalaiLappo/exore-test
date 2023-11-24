/* eslint-disable import/extensions */
import axios from 'axios';
import { ProductData, ProductId, ProductUpdateData } from '@/types/products.js';

axios.defaults.baseURL = 'https://fakestoreapi.com/';

class ProductsService {
  static async fetchProducts(limit: number | 'all') {
    if (typeof limit === 'number' && limit < 1) {
      throw new Error('ProductsService: Invalid limit parameter');
    }
    const url = limit === 'all' ? 'products' : `products?limit=${limit}`;
    const resp = await axios.get(url);
    return resp.data as Promise<ProductData[]>;
  }

  static async removeProduct(id: ProductId) {
    const resp = await axios.delete(`products/${id}`);
    return resp.data;
  }

  static async updateProduct(id: ProductId, productData: ProductUpdateData) {
    const resp = await axios.put(`products/${id}`, productData);
    return resp.data;
  }
}

export default ProductsService;

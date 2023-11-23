/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductSource, ProductStatus } from '@/types/products.js';
import ProductsService from '@/services/products.service';
import { ProcessStatus } from '@/types/shared.js';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (limit: number = 8 /*, thunkAPI*/) => {
    const response = await ProductsService.fetchProducts(limit);
    const now = Date.now();
    const apiProducts: Product[] = response.map((p) => ({
      ...p,
      status: 'Live',
      source: 'API',
      createdAt: now,
      updatedAt: now,
    }));
    return apiProducts;
  }
);

type ProductsSourceFilter = ProductSource | 'ALL';
type ProductsStatusFilter = ProductStatus | 'ALL';
type ProductFilters = {
  source: ProductsSourceFilter;
  status: ProductsStatusFilter;
};

type ProductsState = {
  products: Product[];
  productsFetchStatus: ProcessStatus;
  productFilters: ProductFilters;
};

const initialState: ProductsState = {
  products: [],
  productsFetchStatus: 'idle',
  productFilters: {
    source: 'ALL',
    status: 'ALL',
  },
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    setProductsSourceFilter: (state, action: PayloadAction<ProductFilters>) => {
      state.productFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      const makeMap = (arr: Product[]) =>
        arr.reduce(
          // eslint-disable-next-line no-return-assign, no-sequences
          (o, p) => ((o[p.id] = p), o),
          {} as { [key: number]: Product }
        );
      const [statePsMap, newPsMap] = [state.products, action.payload].map(makeMap);

      state.products = [
        ...state.products.map((p) => (newPsMap[p.id] ? newPsMap[p.id] : p)),
        ...action.payload.filter((p) => !statePsMap[p.id]),
      ];
    });
  },
});

export const {
  deleteProduct,
  addProduct,
  setProductsSourceFilter: toggleProductsSource,
} = productsSlice.actions;

export default productsSlice.reducer;

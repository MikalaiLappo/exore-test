/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductData, ProductId } from '@/types/products.js';
import ProductsService from '@/services/products.service';
import { ProcessStatus } from '@/types/shared.js';

export const fetchProducts = createAsyncThunk<ProductData[], number>(
  'products/fetchProducts',
  async (limit: number = 8 /*, thunkAPI*/) => ProductsService.fetchProducts(limit)
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: ProductId) => {
  await ProductsService.fetchProducts(id);
  return id;
});

type ProductsState = {
  products: Product[];
  /**
   * API is a dummy stateless mock with constant data
   * In a real app I'd probably use react-query / Redux-TKQ
   * I'm also skipping `requestId` stuff
   */
  productsFetchStatus: ProcessStatus;
  productsFetchError: string | null;
  productCreateStatus: ProcessStatus;
  productCreateError: string | null;
  productDeleteStatus: ProcessStatus;
  productDeleteError: string | null;
  productEditStatus: ProcessStatus;
  productEditError: string | null;
};

const initialState: ProductsState = {
  products: [],
  /** */
  productsFetchStatus: 'idle',
  productsFetchError: null,
  productCreateStatus: 'idle',
  productCreateError: null,
  productDeleteStatus: 'idle',
  productDeleteError: null,
  productEditStatus: 'idle',
  productEditError: null,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    initDelete: (state) => {
      state.productDeleteError = null;
      state.productDeleteStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const statePsMap = state.products.reduce(
          (o, p) => ((o[p.id] = p), o),
          {} as { [key: number]: Product }
        );

        const now = Date.now();
        state.products = [
          ...state.products,
          ...action.payload
            .filter((p) => !statePsMap[p.id])
            .map(
              (p) =>
                ({
                  ...p,
                  status: 'Live',
                  source: 'API',
                  isDeleted: false,
                  updatedAt: now,
                  createdAt: now,
                }) as const
            ), // I omit `updatedAt` checks since mock server data never changes
        ];

        state.productsFetchStatus = 'succeeded';
        state.productsFetchError = null;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.productsFetchStatus = 'pending';
        state.productsFetchError = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsFetchStatus = 'failed';
        state.productsFetchError = action.error.message ?? 'Unknown fetch error';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const theProduct = state.products.find((p) => p.id === action.payload);
        if (!theProduct) return;
        if (theProduct.source === 'Local') {
          state.products = state.products.filter((p) => p.id !== action.payload);
        } else {
          state.products = state.products.map((p) =>
            p.id !== action.payload ? p : { ...p, isDeleted: true, updatedAt: Date.now() }
          );
        }

        state.productDeleteStatus = 'succeeded';
        state.productDeleteError = null;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.productDeleteStatus = 'pending';
        state.productDeleteError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productDeleteStatus = 'failed';
        state.productDeleteError = action.error.message ?? 'Unknown delete error';
      });
  },
});

export const { addProduct, initDelete } = productsSlice.actions;

export default productsSlice.reducer;

/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product, ProductData, ProductId, ProductUpdateData } from '@/types/products.js';
import ProductsService from '@/services/products.service';
import { ProcessStatus } from '@/types/shared.js';

export const fetchProducts = createAsyncThunk<ProductData[], number>(
  'products/fetchProducts',
  async (limit: number = 8 /*, thunkAPI*/) => ProductsService.fetchProducts(limit)
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: ProductId) => {
  await ProductsService.removeProduct(id);
  return id;
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: ProductId; productData: ProductUpdateData }
>('products/updateProduct', async ({ id, productData }) => {
  const resp = await ProductsService.updateProduct(id, productData);
  return { ...productData, ...resp, id };
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
    initDelete: (state) => {
      state.productDeleteError = null;
      state.productDeleteStatus = 'idle';
    },
    initEdit: (state) => {
      state.productEditError = null;
      state.productEditStatus = 'idle';
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
        if (!theProduct) {
          state.productDeleteStatus = 'failed';
          state.productDeleteError = 'Product not found';
          return;
        }
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
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const theProduct = state.products.find((p) => p.id === action.payload.id);
        if (!theProduct) {
          state.productEditStatus = 'failed';
          state.productEditError = 'Product not found';
          return;
        }

        state.products = state.products.map((p) =>
          p.id !== action.payload.id ? p : { ...p, ...action.payload, updatedAt: Date.now() }
        );

        state.productEditStatus = 'succeeded';
        state.productEditError = null;
      })
      .addCase(updateProduct.pending, (state) => {
        state.productEditStatus = 'pending';
        state.productEditError = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productEditStatus = 'failed';
        state.productEditError = action.error.message ?? 'Unknown delete error';
      });
  },
});

export const { initEdit, initDelete } = productsSlice.actions;

export default productsSlice.reducer;

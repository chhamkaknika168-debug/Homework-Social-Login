// RTK query
import { apiSlice } from "../api/apiSlice";

// NOTE: these are the _SAME_ API reference!
const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["product"]
    }),
    getProductById: build.query({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: "GET",
      }),
      providesTags: ["product"]
    }),
    createProduct: build.mutation({
      query: (productData) => ({
        url: `/products`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["product"]
    }),
    deleteProduct: build.mutation({
      query: (uuid) => ({
        url: `/products/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"]
    }),
    updateProduct: build.mutation({
      query: ({ uuid, updateProduct}) => ({
        url: `/products/${uuid}`,
        method: "PUT",
        body: updateProduct,
      }),
      invalidatesTags: ["Product"], // so the product list refreshes after update
    }),
  }), 
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;

// function getData(enpoint)

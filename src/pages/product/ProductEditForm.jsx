import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../features/product/productSlice2";
import { data, useNavigate, useParams } from "react-router";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be 0 or more"),
  priceOut: z.number().nonnegative("Price must be positive"),

  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export default function ProductEditForm() {
  const { id } = useParams(); // Get product id from URL param
  const navigate = useNavigate();

  // Fetch existing product data by ID
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  console.log("brand uui  : ", product?.brand?.uuid);

  console.log("data of product to update : ", product);
  const {
    register,
    handleSubmit,
    reset, // important for setting form values dynamically
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // When product data is loaded, set it as default form values
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        stockQuantity: product.stockQuantity,
        priceOut: product.priceOut,
        thumbnail: product.thumbnail,
      });
    }
  }, [product, reset]);

  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const staticData = {
    priceIn: 1,
    discount: product?.discount,
    color: [
      {
        color: "string",
        images: ["string"],
      },
    ],
    warranty: product?.warranty,
    availability: true,
    categoryUuid: product?.category?.uuid,
    supplierUuid: product?.supplier?.uuid,
    brandUuid: product?.brand?.uuid,
  };

  const onSubmit = async (formData) => {
    try {
      await updateProduct({ id, ...staticData, ...formData }).unwrap();
      navigate("/products");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto flex flex-col gap-4"
    >
      <input
        {...register("name")}
        placeholder="Name"
        className="border p-2 rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <textarea
        {...register("description")}
        placeholder="Description"
        className="border p-2 rounded"
        rows={3}
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <input
        {...register("stockQuantity", { valueAsNumber: true })}
        type="number"
        placeholder="Stock Quantity"
        className="border p-2 rounded"
      />
      {errors.stockQuantity && (
        <p className="text-red-500">{errors.stockQuantity.message}</p>
      )}

      <input
        {...register("priceOut", { valueAsNumber: true })}
        type="number"
        placeholder="Price Out"
        step="any"
        className="border p-2 rounded"
      />
      {errors.priceOut && (
        <p className="text-red-500">{errors.priceOut.message}</p>
      )}

      <input
        {...register("thumbnail")}
        placeholder="Thumbnail URL"
        className="border p-2 rounded"
      />
      {errors.thumbnail && (
        <p className="text-red-500">{errors.thumbnail.message}</p>
      )}

      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        {updating ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}

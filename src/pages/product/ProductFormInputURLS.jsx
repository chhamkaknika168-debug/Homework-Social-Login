import React from "react";
import { useCreateProductMutation } from "../../features/product/productSlice2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be 0 or more"),
  priceIn: z.number().positive("Price In must be greater than 0"),
  priceOut: z.number().positive("Price Out must be greater than 0"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export default function ProductForm2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
  });

  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  // Static/fixed data you want to keep
  const staticData = {
    computerSpec: {
      processor: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      os: "N/A",
      screenSize: "N/A",
      battery: "N/A",
    },
    discount: 0,
    color: [
      {
        color: "Fresh Green",
        images: [
          "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500",
        ],
      },
    ],
    warranty: "5 Days Freshness Guarantee",
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800",
    ],
    categoryUuid: "eb115ca4-a6b2-43f7-aa59-2def7e30dd7b",
    supplierUuid: "fd9d42e3-3afc-43a8-8eb4-7cb4c1c9b411",
    brandUuid: "8620f990-ef33-495c-b38c-236da90c9b46",
  };

  const onSubmit = async (data) => {
    try {
      // Merge form data with static data
      const payload = {
        ...data,
        ...staticData,
      };
      const result = await createProduct(payload).unwrap();
      if (result) {
        navigate("/products");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="m-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md mx-auto"
      >
        <input
          {...register("name")}
          placeholder="Name"
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Description"
          className="border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        <input
          {...register("stockQuantity", { valueAsNumber: true })}
          type="number"
          placeholder="Stock Quantity"
          className="border border-gray-300 rounded px-3 py-2"
          min={0}
        />
        {errors.stockQuantity && (
          <p className="text-red-500 text-sm">{errors.stockQuantity.message}</p>
        )}

        <input
          {...register("priceIn", { valueAsNumber: true })}
          type="number"
          placeholder="Price In"
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors.priceIn && (
          <p className="text-red-500 text-sm">{errors.priceIn.message}</p>
        )}

        <input
          {...register("priceOut", { valueAsNumber: true })}
          type="number"
          placeholder="Price Out"
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors.priceOut && (
          <p className="text-red-500 text-sm">{errors.priceOut.message}</p>
        )}

        <input
          {...register("thumbnail")}
          type="url"
          placeholder="Thumbnail URL"
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white rounded py-2 px-4"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}

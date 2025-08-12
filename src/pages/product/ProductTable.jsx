import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../features/product/productSlice2";
import { Link, NavLink } from "react-router";
import DataTable from "react-data-table-component";
import { id } from "zod/v4/locales";

export default function Products() {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateProduct({ id, ...updatedData });
    } catch (e) {
      console.error("Failed to update product:", e);
    }
  };
  const columns = [
    {
      name: "Thumbnail",
      selector: (row) =>
        row?.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={row.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.category?.name,
    },
    {
      name: "Price",
      selector: (row) => row?.priceOut + " $",
    },
    {
      name: "Stock",
      selector: (row) => row?.stockQuantity,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/edit/${row.uuid}`}
            className="inline-flex h-[40px] my-5 items-center  text-white rounded-md  bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600   p-2"
          >
            <span>Edit</span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete(row?.uuid);
            }}
            className="inline-flex h-[40px] my-5 items-center  text-white rounded-md  bg-red-500 transition-colors duration-300 hover:bg-red-600   p-2"
          >
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  console.log("data from RTK Query", data);

  return (
    <main className="max-w-screen-xl mx-auto container px-10">
      <Link
        to={`/add-product`}
        className="inline-flex h-[40px] my-5 items-center  text-white rounded-md  bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600   p-2"
      >
        <span>Add Product</span>
      </Link>
      <DataTable
        title="All Products "
        columns={columns}
        data={data?.content}
        pagination
        progressPending={isLoading}
      />
    </main>
  );
}

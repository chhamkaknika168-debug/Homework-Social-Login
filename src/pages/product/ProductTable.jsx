//  import {
//    useDeleteProductMutation,
//    useGetProductsQuery,
//    useUpdateProductMutation,
//  } from "../../features/product/productSlice2";
//  import { Button, Modal, ModalBody } from "flowbite-react";
//  import { Link, NavLink } from "react-router";
//  import DataTable from "react-data-table-component";
//  import { id } from "zod/v4/locales";
//  import { useEffect, useState } from "react";
//  import styled from 'styled-components';

//  export default function Products() {
//    const { data, isLoading } = useGetProductsQuery();
//    const [deleteProduct] = useDeleteProductMutation();
//    const [updateProduct] = useUpdateProductMutation();
//    const {data: singleProduct} = useGetProductsQuery(uuid);
//    const [uuid, setUuid] = useState();
//    const [openModal, setOpenModal] = useState(true);


//    // handle delete
//   const handleDelete = async (uuid) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       await deleteProduct(uuid);
//     }
//   };

//   useEffect(() => {

//     const handlePreview = (uuid) => {
//        console.log("=====> uuid", uuid);
//        setUuid(uuid);

//         if(singleProduct){
//           return(
//             <div>
//                 <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
//                 <Modal show={openModal} onClose={() => setOpenModal(false)}>
//                   <ModalHeader>{singleProduct.name}</ModalHeader>
//                   <ModalBody>
//                     <div className="space-y-6">
//                       {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//                         With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
//                         companies around the world are updating their terms of service agreements to comply.
//                       </p> */}
//                      <img src={singleProduct.thumbnail} alt={singleProduct.name} />
//                       <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//                         {singleProduct.description}
//                       </p>
//                     </div>
//                   </ModalBody>
//                   {/* <ModalFooter>
//                     <Button onClick={() => setOpenModal(false)}>I accept</Button>
//                     <Button color="alternative" onClick={() => setOpenModal(false)}>
//                       Decline
//                     </Button>
//                   </ModalFooter> */}
//                 </Modal>
//             </div>
//           )
//         }
//     }
//      handlePreview();
//   }, []);

//    // handle Update
//    const handleUpdate = async (uuid, updatedData) => {
//      try {
//        await updateProduct({ uuid, ...updatedData });
//      } catch (e) {
//        console.error("Failed to update product:", e);
//      }
//    };
//    const columns = [
//      {
//        name: "Thumbnail",
//        selector: (row) =>
//          row?.thumbnail ? (
//            <img
//              src={row.thumbnail}
//              alt={row.name}
//              className="w-12 h-12 object-cover rounded"
//            />
//          ) : (
//            "No Image"
//          ),
//      },
//      {
//        name: "Product Name",
//        selector: (row) => row?.name,
//        sortable: true,
//      },
//      {
//        name: "Category",
//        selector: (row) => row?.category?.name,
//      },
//      {
//        name: "Price Out",
//        selector: (row) => row?.priceOut + " $",
//      },
//       {
//        name: "Stock Quantity",
//        selector: (row) => row?.stockQuantity,
//      },
//      {
//        name: "Discount (%)",
//        selector: (row) => row?.discount,
//      },
//      {
//        name: "Supplier",
//        selector: (row) => row?.supplier.name,
//      },
//      {
//        name: "Actions",
//        button: true,
//        cell: (row) => (
//          <div className="flex gap-3">
//            {/* <Link
//              to={`/edit/${row.uuid}`}
//              className="inline-flex h-[40px] my-5 items-center  text-white rounded-md  bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600   p-2"
//            >
//              <span>Edit</span>
//            </Link> */}
//            <button
//              onClick={(e) => {
//                e.preventDefault();
//                handleDelete(row?.uuid);
//              }}
//              className="inline-flex h-[40px] my-5 items-center text-sm text-white rounded-xl  bg-red-500 transition-colors duration-300 hover:bg-red-600   p-2"
//            >
//              <span>Delete</span>

//            </button>
//            <button
//              onClick={(e) => {
//                e.preventDefault();
//                handlePreview(row?.uuid);
//              }}
//              className="inline-flex h-[40px] my-5 items-center text-sm text-white rounded-xl  bg-blue-400 transition-colors duration-300 hover:bg-red-600   p-2"
//            >
//              <span>Preview</span>
//            </button>
//          </div>
//        ),
//        ignoreRowClick: true,
//        allowOverflow: true,
//        button: true,
//      }
//    ];

  
//  const ClearButton = styled(Button)`
//  	border-top-left-radius: 0;
//  	border-bottom-left-radius: 0;
//  	border-top-right-radius: 5px;
//  	border-bottom-right-radius: 5px;
//  	height: 34px;
//  	width: 32px;
//  	text-align: center;
//  	display: flex;
//  	align-items: center;
//  	justify-content: center;
//  `;

//    const FilterComponent = ({ filterText, onFilter, onClear }) => (
//  	<>
//  		<TextField
//  			id="search"
//  			type="text"
//  			placeholder="Filter By Name"
//  			aria-label="Search Input"
//  			value={filterText}
//  			onChange={onFilter}
//  		/>
//  		<ClearButton type="button" onClick={onClear}>
//  			X
//  		</ClearButton>
//  	</>
//  );

//    console.log("data from RTK Query", data);

//    return (
//      <main className="max-w-screen-xl mx-auto container px-10">
//        <Link
//          to={`/Create Product`}
//          className="inline-flex h-[40px] my-5 items-center  text-white rounded-md  bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600   p-2"
//        >
//          <span>Create Product</span>
//        </Link>
//        <DataTable
//          title="All Products "
//          columns={columns}
//          data={data?.content}
//          subHeader subHeaderComponent = {subHeaderComponentMemo}
//          paginationResetDefaultPage = {resetPaginationToggle}
//          pagination
//          selectableRows
//          highlightOnHover
//          pointerOnHover
//          progressPending={isLoading}
//          onRowClicked={row => setPreviewProduct(row)}
        

//          // columns={columns}
//          // data={filteredItems}
//          // progressPending={isLoading}
//          // paginationResetDefaultPage = {resetPaginationToggle}
//          // pagination
//          // selectableRows
//          // highlightOnHover
//          // subHeader subHeaderComponent = {subHeaderComponentMemo}
//          // pointerOnHover
//          // onRowClicked={row => setPreviewProduct(row)}

//        />
//      </main>
//    );
//  }



 import {
   useDeleteProductMutation,
   useGetProductsQuery,
   useUpdateProductMutation,
 } from "../../features/product/productSlice2";
 import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
  import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useEffect, useState, useMemo } from "react";
import styled from 'styled-components';

const Products = () => {
  const { data: products, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPagination, setResetPagination] = useState(false);

  // Get single product when selected
  const { data: selectedProduct } = useGetProductsQuery(selectedProductId, {
    skip: !selectedProductId
  });

  // Filter products by name
  const filteredProducts = useMemo(() => {
    if (!products?.content) return [];
    return products.content.filter(product =>
      product.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [products, filterText]);

  const handleDelete = async (productId) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(productId);
    }
  };

  const handlePreview = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleUpdate = async (productId, updatedData) => {
    try {
      await updateProduct({ uuid: productId, ...updatedData });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columns = [
    {
      name: "Thumbnail",
      cell: (row) => (
        <img
          src={row.thumbnail || '/placeholder-image.png'}
          alt={row.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category?.name || 'N/A',
    },
    {
      name: "Price",
      selector: (row) => `$${row.priceOut}`,
    },
    {
      name: "Stock",
      selector: (row) => row.stockQuantity,
    },
    {
      name: "Discount",
      selector: (row) => `${row.discount}%`,
    },
    {
      name: "Supplier",
      selector: (row) => row.supplier?.name || 'N/A',
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(row.uuid)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-red-600"
          >
            Updat
          </button>
          <button
            onClick={() => handleDelete(row.uuid)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-blue-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const FilterComponent = ({ onFilter, onClear, filterText }) => (
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Filter by name..."
        value={filterText}
        onChange={onFilter}
        className="border p-2 rounded-l"
      />
      <button
        onClick={onClear}
        className="bg-gray-200 px-3 rounded-r hover:bg-gray-300"
      >
        X
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/products/create"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Product
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        progressPending={isLoading}
        pagination
        paginationResetDefaultPage={resetPagination}
        subHeader
        subHeaderComponent={
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={() => {
              setFilterText('');
              setResetPagination(!resetPagination);
            }}
            filterText={filterText}
          />
        }
      />

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Product Details</ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <div className="space-y-4">
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="w-full h-48 object-contain"
              />
              <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Price:</h3>
                  <p>${selectedProduct.priceOut}</p>
                </div>
                <div>
                  <h3 className="font-medium">Stock:</h3>
                  <p>{selectedProduct.stockQuantity}</p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Products;

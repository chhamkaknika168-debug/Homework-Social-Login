
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
} from "../../features/product/productSlice2";
import { Button, Modal, ModalBody, ModalHeader, Checkbox, TextInput } from "flowbite-react";
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";

const Products = () => {
  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateProductMutation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterText, setFilterText] = useState('');

  // Initialize new product form data
  const [productForm, setProductForm] = useState({
    name: '',
    priceOut: '',
    stockQuantity: '',
    thumbnail: '',
    description: ''
  });

  // Filter products by name
  const filteredProducts = useMemo(() => {
    if (!products?.content) return [];
    return products.content.filter(product =>
      product.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [products, filterText]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
      console.log(editingProduct)
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  // Product operations
  const handleCreate = async () => {
    try {
      await createProduct(productForm);
      setIsModalOpen(false);
      setProductForm({
        name: '',
        priceOut: '',
        stockQuantity: '',
        thumbnail: '',
        description: ''
      });
      refetch();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(editingProduct);
      setIsModalOpen(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      refetch();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0 && window.confirm("Delete selected products?")) {
      await Promise.all(selectedIds.map(id => deleteProduct(id)));
      setSelectedIds([]);
      refetch();
    }
  };

  // Table columns
  const columns = [
    {
      name: '',
      cell: (row) => (
        <Checkbox
          checked={selectedIds.includes(row.uuid)}
          onChange={() => setSelectedIds(prev =>
            prev.includes(row.uuid) 
              ? prev.filter(id => id !== row.uuid) 
              : [...prev, row.uuid]
          )}
        />
      ),
      width: '60px',
    },
    {
      name: 'Thumbnail',
      cell: (row) => (
        <div className="flex items-center">
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <span className="text-2xl">📦</span>
          )}
        </div>
      ),
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => `$${row.priceOut}`,
      sortable: true,
    },
    {
      name: 'Stock',
      selector: row => row.stockQuantity,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            color="blue"
            onClick={() => {
              setEditingProduct(row);
              setIsModalOpen(true);
            }}
          >
            Update
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDelete(row.uuid)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-3">
          {selectedIds.length > 0 && (
            <Button color="red" onClick={handleBulkDelete}>
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button color="green" onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}>
            Create Product
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Filter By Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          icon={() => <span>🔍</span>}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        progressPending={isLoading}
        pagination
        highlightOnHover
      />

      {/* Create/Update Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          {editingProduct ? 'Edit Product' : 'Create Product'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Product Name</label>
              <TextInput
                name="name"
                value={editingProduct?.name || productForm.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Price ($)</label>
                <TextInput
                  name="priceOut"
                  type="number"
                  value={editingProduct?.priceOut || productForm.priceOut}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block mb-1">Stock Quantity</label>
                <TextInput
                  name="stockQuantity"
                  type="number"
                  value={editingProduct?.stockQuantity || productForm.stockQuantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Thumbnail URL</label>
              <TextInput
                name="thumbnail"
                value={editingProduct?.thumbnail || productForm.thumbnail}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <TextInput
                name="description"
                value={editingProduct?.description || productForm.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button color="gray" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                color="blue" 
                onClick={editingProduct ? handleUpdate : handleCreate}
              >
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Products;
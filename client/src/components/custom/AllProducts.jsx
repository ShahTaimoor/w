import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, updateProduct, deleteProduct } from '@/redux/slices/productSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { removeFromCart } from '@/redux/slices/cartSlice';

const AllProducts = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStock, setEditStock] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [editImages, setEditImages] = useState([]);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    const getFilterProducts = async () => {
      setLoading(true);
      setError(null);
      setNoProductsFound(false);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-products?category=${category}&search=${searchTerm}`
        );
        const fetchedProducts = res.data?.data || [];
        dispatch(setProducts(fetchedProducts));
        setNoProductsFound(fetchedProducts.length === 0);
      } catch (error) {
        toast('Category Not Found');
        dispatch(setProducts([]));     
        setNoProductsFound(true);
      } finally {
        setLoading(false);
      }
    };
    getFilterProducts();
  }, [searchTerm, category, dispatch]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock);
    setEditCategory(product.category);
    setIsEditModelOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('price', editPrice);
    formData.append('stock', editStock);
    formData.append('category', editCategory);

    if (editImages.length > 0) {
      editImages.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update-product/${editingProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(`${editName} updated successfully`);
        const updatedProduct = res.data.data;
        dispatch(updateProduct(updatedProduct));

        setIsEditModelOpen(false);
        setEditImages([]);
      }
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        toast.success('Product deleted successfully');
        dispatch(deleteProduct(id));
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Explore Our Products</h1>
        <p className="text-muted-foreground text-lg">Discover premium automotive accessories</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="flex-1 h-12 rounded-lg border-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-primary"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-lg border-muted-foreground/30">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Perfume & Fragrances">Perfume & Fragrances</SelectItem>
            <SelectItem value="Stickers Emblems Key Chains">Stickers Emblems Key Chains</SelectItem>
            <SelectItem value="Interior">Interior</SelectItem>
            <SelectItem value="Exterior">Exterior</SelectItem>
            <SelectItem value="Security Badges">Security Badges</SelectItem>
            <SelectItem value="Lightening">Lightening</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loader and Error Handling */}
      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
      )}

      {!loading && noProductsFound && (
        <div className="text-center text-muted-foreground text-lg mt-4">
          No products found for this category.
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products?.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
            <div className="aspect-square bg-muted/50">
              <img
                src={item.image?.[0]?.url || '/fallback.jpg'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold line-clamp-1">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-primary text-xl font-bold">{`$${item.price}`}</span>
                <span className="text-sm text-muted-foreground">{`Stock: ${item.stock}`}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item._id)}
                className="w-full mt-2"
              >
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="w-full mt-2">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditModelOpen} onOpenChange={setIsEditModelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-6 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perfume & Fragrances">Perfume & Fragrances</SelectItem>
                    <SelectItem value="Stickers Emblems Key Chains">Stickers Emblems Key Chains</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Exterior">Exterior</SelectItem>
                    <SelectItem value="Security Badges">Security Badges</SelectItem>
                    <SelectItem value="Lightening">Lightening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setEditImages([...e.target.files])}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllProducts;

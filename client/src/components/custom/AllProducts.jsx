import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';
<<<<<<< HEAD
import { Loader2, Trash2, Edit, Search } from 'lucide-react';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts } from '@/redux/slices/products/productSlice';
import { useNavigate } from 'react-router-dom';
=======
import { Loader2, Trash2, Plus, Search, Filter, PackageSearch, Pencil } from 'lucide-react';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { deleteProduct, fetchProducts } from '@/redux/slices/products/productSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

const AllProducts = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { categories } = useSelector(s => s.categories);
  const { products, status } = useSelector(s => s.products);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(AllCategory());
  }, [dispatch]);

  useEffect(() => {
<<<<<<< HEAD
    dispatch(fetchProducts({ category, searchTerm }));
  }, [category, searchTerm, dispatch]);

=======
    const timer = setTimeout(() => {
      dispatch(fetchProducts({ category, searchTerm }));
    }, 300); // Debounce search by 300ms
    return () => clearTimeout(timer);
  }, [category, searchTerm, dispatch]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
  const loading = status === 'loading';
  const noProducts = status === 'succeeded' && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
<<<<<<< HEAD
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <Button onClick={() => navigate('/admin/dashboard/add-product')}>
          Add New Product
        </Button>
      </div>

      {/* Search and filter section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status indicators */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {noProducts && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => {
              setCategory('all');
              setSearchTerm('');
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map(product => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image || '/placeholder-product.png'}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 line-clamp-1">{product.title}</h3>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">${product.price}</span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/admin/dashboard/update/${product._id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this product?")) {
                      dispatch(deleteSingleProduct(product._id));
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
=======
      {/* Header with search and filters */}
      <div className="mb-8">


        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, category..."
              className="pl-9"
            />
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status indicators */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {noProducts && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <PackageSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search or filter' : 'Add a new product to get started'}
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setCategory('all');
            }}
            variant="outline"
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <Card key={p._id} className="group overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={p.image || '/placeholder-product.jpg'}
                alt={p.title}
                width={1600}
                height={1600}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.jpg';
                }}
              />
              {p.stock <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-medium line-clamp-2" title={p.title}>
                  {p.title}
                </h3>
                <Badge variant="outline" className="font-medium">
                  ${p.price}
                </Badge>
              </div>

              {p.category?.name && (
                <p className="text-sm text-muted-foreground">{p.category.name}</p>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-block h-2 w-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                <span className="text-muted-foreground">
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => navigate(`/admin/dashboard/update/${p._id}`)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(p._id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
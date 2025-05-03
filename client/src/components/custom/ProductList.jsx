import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Search, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/redux/slices/cartSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts } from '@/redux/slices/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductList = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((s) => s.categories);
  const { products, status } = useSelector((s) => s.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = {};
      products.forEach((product) => {
        initialQuantities[product._id] = 0;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const handleQuantityChange = (productId, value, stock) => {
    let newValue = parseInt(value) || 0;
    newValue = Math.max(0, Math.min(newValue, stock));
    setQuantities((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning('You must login first');
      navigate('/login');
      return;
    }

    if (quantities[product._id] <= 0) {
      toast.warning('Please select at least 1 item');
      return;
    }

    setIsAddingToCart((prev) => ({ ...prev, [product._id]: true }));

    dispatch(
      addToCart({
        _id: product._id,
        name: product.title,
        price: product.price,
        stock: product.stock,
        quantity: quantities[product._id],
        image: product.image,
      })
    );

    setIsAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    toast.success(`${product.title} added to cart`);
    setQuantities((prev) => ({ ...prev, [product._id]: 0 }));
  };

  useEffect(() => {
    dispatch(AllCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ category, searchTerm }));
  }, [category, searchTerm, dispatch]);

  const loadingProducts = status === 'loading';
  const noProducts = status === 'succeeded' && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover amazing products for your needs</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 pl-10"
          />
        </div>
        <div className="space-y-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCategory('all')}
          >
            <img
              src="/default-category-image.jpg" // Default image for "All Categories"
              alt="All Categories"
              className="w-5 h-5 object-cover rounded-full"
            />
            <span>All Categories</span>
          </div>

          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCategory(cat._id)} // Set the category to the selected one
            >
              {cat.picture && (
                <img
                  src={cat.picture?.secure_url || '/fallback-category-image.jpg'}
                  alt={cat.name}
                  className="w-5 h-5 object-cover rounded-full"
                />
              )}
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {loadingProducts && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      )}
      {noProducts && !loadingProducts && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <div className="relative aspect-square">
              <img
                src={product.image || '/fallback.jpg'}  // Default fallback image
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium bg-red-500 px-2 py-1 rounded-md text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {product.title}
                </h3>
                <span className="font-bold text-gray-900 ml-2 whitespace-nowrap">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {product.category?.name || 'Uncategorized'}
                </span>
                <span className={`ml-auto text-xs ${product.stock > 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Sold out'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(
                      product._id,
                      quantities[product._id] - 1,
                      product.stock
                    )}
                    disabled={quantities[product._id] <= 0 || product.stock === 0}
                    className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={product.stock}
                    value={quantities[product._id] || 0}
                    onChange={(e) =>
                      handleQuantityChange(
                        product._id,
                        e.target.value,
                        product.stock
                      )
                    }
                    className={`w-full text-center border rounded-md p-1 ${product.stock === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    disabled={product.stock === 0}
                  />
                  <button
                    onClick={() => handleQuantityChange(
                      product._id,
                      quantities[product._id] + 1,
                      product.stock
                    )}
                    disabled={quantities[product._id] >= product.stock || product.stock === 0}
                    className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={
                    loadingProducts ||
                    isAddingToCart[product._id] ||
                    quantities[product._id] <= 0 ||
                    product.stock === 0
                  }
                  className="w-full"
                  size="sm"
                >
                  {isAddingToCart[product._id] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

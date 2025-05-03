import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { addToCart } from '@/redux/slices/cartSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts } from '@/redux/slices/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductList = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({}); // Track quantity per product
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(s => s.categories);
  const { products, status } = useSelector(s => s.products);
  const { user } = useSelector((state) => state.auth);

  // Initialize quantities when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = {};
      products.forEach(product => {
        initialQuantities[product._id] = 0;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  // handle quantity change for a product
  const handleQuantityChange = (productId, value, stock) => {
    let newValue = parseInt(value) || 0;
    
    // Ensure value is between 0 and stock
    newValue = Math.max(0, Math.min(newValue, stock));
    
    setQuantities(prev => ({
      ...prev,
      [productId]: newValue
    }));
  };

  // handle adding to the cart
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

    setIsAddingToCart(true);

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

    setIsAddingToCart(false);
    toast.success('Product added to cart');
    // Reset quantity after adding to cart
    setQuantities(prev => ({ ...prev, [product._id]: 0 }));
  };

  // Fetch categories and products based on the filters
  useEffect(() => {
    dispatch(AllCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ category, searchTerm }));
  }, [category, searchTerm, dispatch]);

  const loadingProducts = status === 'loading';
  const noProducts = status === 'succeeded' && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Search + Category Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search products…"
          className="flex-1"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
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

      {/* Loading & Empty States */}
      {loadingProducts && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}
      {noProducts && !loadingProducts && (
        <p className="text-center text-lg text-gray-500">No products found.</p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img
              src={product.image || '/fallback.jpg'}
              alt={product.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category?.name}</p>
              <div className="flex justify-between items-center mb-2">
              
                <span className={`text-sm ${product.stock === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                  {product.stock === 0 ? 'Out of Stock' : `Stock: ${product.stock}`}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-4">
                <input
                  type="number"
                  min="0"
                  max={product.stock}
                  value={quantities[product._id] || 0}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value, product.stock)}
                  className={`w-full text-center border rounded-md text-sm p-1 mb-2 ${
                    product.stock === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={product.stock === 0}
                />

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingProducts || isAddingToCart || quantities[product._id] <= 0 || product.stock === 0}
                  className={`w-full px-4 py-2 text-sm rounded-lg transition-colors ${
                    loadingProducts || isAddingToCart || quantities[product._id] <= 0 || product.stock === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  } text-white`}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
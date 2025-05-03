import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../ui/input';
<<<<<<< HEAD
=======
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Search, ShoppingCart } from 'lucide-react';
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
import { addToCart } from '@/redux/slices/cartSlice';
import { AllCategory } from '@/redux/slices/categories/categoriesSlice';
import { fetchProducts } from '@/redux/slices/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
<<<<<<< HEAD
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Loader2 } from 'lucide-react';
=======
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

const ProductList = () => {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
<<<<<<< HEAD
  const [quantities, setQuantities] = useState({}); // Track quantity per product
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(s => s.categories);
  const { products, status } = useSelector(s => s.products);
  const { user } = useSelector((state) => state.auth);

  // Function to chunk the categories array into chunks (7 for the first page, 8 for others)
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

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
=======
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

>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
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

<<<<<<< HEAD
    setIsAddingToCart(true);
=======
    setIsAddingToCart((prev) => ({ ...prev, [product._id]: true }));
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

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

<<<<<<< HEAD
    setIsAddingToCart(false);
    toast.success('Product added to cart');
    // Reset quantity after adding to cart
    setQuantities(prev => ({ ...prev, [product._id]: 0 }));
  };

  // Fetch categories and products based on the filters
=======
    setIsAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    toast.success(`${product.title} added to cart`);
    setQuantities((prev) => ({ ...prev, [product._id]: 0 }));
  };

>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
  useEffect(() => {
    dispatch(AllCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ category, searchTerm }));
  }, [category, searchTerm, dispatch]);

  const loadingProducts = status === 'loading';
  const noProducts = status === 'succeeded' && products.length === 0;

<<<<<<< HEAD
  // Chunk the categories into groups
  const firstPageChunk = chunkArray(categories, 7);  // First page shows 7 categories
  const otherPageChunks = chunkArray(categories.slice(7), 8);  // Other pages show 8 categories

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Category List as Images */}
      <Swiper
        pagination={true}
        modules={[Pagination]}
        className="mySwiper"
        spaceBetween={10}
      >
        {/* Add the "All" category to the beginning */}
        {[...firstPageChunk, ...otherPageChunks].map((chunk, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-4 gap-4 pb-4 mb-6">
              {/* If chunk is the first one, add the "All" category */}
              {index === 0 && (
                <div
                  className={`cursor-pointer flex flex-col items-center w-24 text-center p-2 ${category === 'all' ? 'border-b' : 'bg-white'}`}
                  onClick={() => setCategory('all')}
                >
                  <div className="flex justify-center">
                    <img
                      src="https://cdn.pixabay.com/photo/2023/07/19/12/16/car-8136751_1280.jpg"
                      alt="All"
                      className="w-12 rounded-full h-12 object-cover"
                    />
                  </div>
                  <p className="text-sm mt-1 text-center w-full">All</p>
                </div>
              )}
              {/* Render the remaining categories */}
              {chunk.map(cat => (
                <div
                  key={cat._id}
                  className={`cursor-pointer flex flex-col items-center w-24 text-center p-2 ${category === cat._id ? 'border-b' : 'bg-white'}`}
                  onClick={() => setCategory(cat._id)}
                >
                  <div className="flex justify-center">
                    <img
                      src={cat.image || '/fallback.jpg'}
                      alt={cat.name}
                      className="w-12 rounded-full h-12 object-cover"
                    />
                  </div>
                  <p className="text-sm mt-1 text-center w-full">{cat.name}</p>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Search + Category Filters */}
      <Input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search products…"
        className="flex-1 mb-5"
      />

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
            width={1600}
            height={1600}
              src={product.image || '/fallback.jpg'}
              alt={product.title}
              className="w-full object-cover"
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
                  className={`w-full text-center border rounded-md text-sm p-1 mb-2 ${product.stock === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={product.stock === 0}
                />

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingProducts || isAddingToCart || quantities[product._id] <= 0 || product.stock === 0}
                  className={`w-full px-4 py-2 text-sm rounded-lg transition-colors ${loadingProducts || isAddingToCart || quantities[product._id] <= 0 || product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                    } text-white`}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
=======
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
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

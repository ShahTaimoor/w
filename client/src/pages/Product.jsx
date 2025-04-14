import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToCart } from '@/redux/slices/cartSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const { productName } = useParams();
  const [purchaseProduct, setPurchaseProduct] = useState(false);
  const [address, setAddress] = useState('');
  const [products, setProducts] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    if (value > products.stock) {
      toast.warning(`Only ${products.stock} items in stock.`);
      setQuantity(products.stock);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setProducts(prev => ({
      ...prev,
      stock: prev.stock - quantity
    }));

    dispatch(addToCart({
      _id: products._id,
      name: products.name,
      price: products.price,
      stock: products.stock - quantity,
      quantity: quantity,
      image: products?.images?.[0]?.[0]?.url
    }));

    setQuantity(1);
    toast.success('Product added to cart');
  };

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!address.trim()) {
      toast.error('Please enter your shipping address');
      return;
    }

    try {
      setProducts(prev => ({
        ...prev,
        stock: prev.stock - quantity
      }));

      const orderData = {
        products: [{
          id: products._id,
          quantity,
        }],
        amount: (products.price * quantity).toFixed(2),
        address,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/order`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        toast.success('Order placed successfully!');
        setPurchaseProduct(false);
        navigate('/orders');
      } else {
        setProducts(prev => ({
          ...prev,
          stock: prev.stock + quantity
        }));
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error(error);
      setProducts(prev => ({
        ...prev,
        stock: prev.stock + quantity
      }));
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  useEffect(() => {
    const fetchProductByName = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-product-by-name/${productName?.split("-").join(" ")}`
        );
        const { data } = await res.data;
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProductByName();
  }, [productName, navigate]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-1/2 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="w-full h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-8 h-96">
            <img
              src={products?.images?.[0]?.[selectedImage]?.url || '/placeholder-product.png'}
              alt={products?.name}
              className="object-contain h-full w-full mix-blend-multiply"
              loading="eager"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-3">
            {products?.images?.[0]?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-contain bg-gray-100"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{products?.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-900">Rs{products?.price?.toLocaleString()}</span>
              {products.originalPrice && products.originalPrice > products.price && (
                <>
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    Rs{products.originalPrice.toLocaleString()}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                    {Math.round((1 - products.price / products.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="text-gray-600 leading-relaxed">{products.description || 'No description available.'}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center text-sm">
            {products.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({products.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={products.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-x focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => setQuantity(Math.min(products.stock, quantity + 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={quantity >= products.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 py-6 bg-primary hover:bg-primary/90 transition-colors"
              disabled={products.stock <= 0}
            >
              Add to Cart
            </Button>
            <Button
              onClick={() => setPurchaseProduct(true)}
              className="flex-1 py-6 bg-gray-900 hover:bg-gray-800 transition-colors"
              disabled={products.stock <= 0}
            >
              Buy Now
            </Button>
          </div>

          {/* Purchase Form */}
          {purchaseProduct && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-4 animate-in fade-in">
              <h3 className="font-medium text-gray-900">Shipping Information</h3>
              <Input
                placeholder="Enter your full shipping address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setPurchaseProduct(false)}
                  className="flex-1 mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmOrder}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

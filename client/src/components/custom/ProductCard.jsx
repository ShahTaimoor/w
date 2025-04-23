import { addToCart } from '@/redux/slices/cartSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ _id, name, image = [], price, stock }) => {
  const [quantity, setQuantity] = useState(0); 
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Handle quantity change in input
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);  
    if (value > stock) {
      toast.warning(`Only ${stock} items in stock.`);
      setQuantity(stock);  
    } else {
      setQuantity(value);
    }
  };

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);

   
    const updatedStock = stock - quantity;

    
    dispatch(
      addToCart({
        _id,
        name,
        price,
        stock: updatedStock,
        quantity,
        image: image?.[0]?.url,
      })
    );

   
    setTimeout(() => {
      setLoading(false);
      setQuantity(0); 
      toast.success('Product added to cart');
    }, 600);
  };

  return (
    <div className="group flex flex-col justify-between h-full overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden max-w-[1600px] max-h-[1600px]">
      
          <img
            src={image?.[0]?.url || '/fallback.jpg'}
            alt={`Image of ${name}`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            width={1600}
            height={1600}
            loading="lazy"
          />
        
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 min-h-[3rem]">
          {name}
        </h3>

        <div className="flex justify-between items-center">
          {/* Quantity Input */}
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full text-center border rounded-md text-sm p-1"
            disabled={stock === 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          />
        </div>

        {/* Stock Status */}
        <div className="flex items-center text-sm">
          {stock > 0 ? (
            <span className="text-green-600 font-medium">
              In Stock ({stock} available)
            </span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || quantity < 1 || stock === 0}
          className={`w-full px-4 py-2 mt-auto text-sm rounded-lg transition-colors ${loading || quantity < 1 || stock === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            } text-white`}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

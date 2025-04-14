import { addToCart } from '@/redux/slices/cartSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({
  _id,
  name,
  image = [],
  price,
  stock,
}) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);

    if (value > stock) {
      toast.warning(`Only ${stock} items in stock.`);
      setQuantity(stock);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(addToCart({
      _id,
      name,
      price,
      stock,
      quantity,
      image: image?.[0]?.url,
    }));

    setQuantity(1);
    toast.success('Product added to cart');
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden max-w-[1600px] max-h-[1600px]">
        <Link to={`/product/${name.split(" ").join("-")}`}>
          <img
            src={image?.[0]?.url || '/fallback.jpg'}
            alt={`Image of ${name}`}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            width={1600}
            height={1600}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {name}
        </h3>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">
            ${price.toLocaleString()}
          </p>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center border rounded-md text-sm p-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

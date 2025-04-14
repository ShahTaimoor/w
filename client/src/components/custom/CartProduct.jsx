import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CartProduct = ({ _id, name, price, quantity, image, stock }) => {
    const navigate = useNavigate();
    const total = price * quantity;

    const handleBuyNow = async () => {
        if (quantity > stock) {
            toast.error('Product out of stock');
            return;
        }
        navigate('/'); 
    };

    return (
        <div
            className="flex justify-between items-center py-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={handleBuyNow}
        >
            <div className="flex items-center">
                <img
                    src={image || '/fallback.jpg'} // ✅ Fallback image
                    alt={name}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{name}</h4>
                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                </div>
            </div>
            <div className="flex items-center">
                <p className="font-semibold text-gray-900">
                    ₹{total.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default CartProduct;

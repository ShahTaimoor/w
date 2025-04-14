import React, { useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import CartProduct from './CartProduct';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { emptyCart } from '@/redux/slices/cartSlice';
import { toast } from 'sonner';

const CartDrawer = () => {
    const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [stockErrors, setStockErrors] = useState([]);

    const handleBuyNow = async () => {
        if (!isAuthenticated) return navigate('/login');

        if (cartItems.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        if (!address.trim()) {
            toast.error('Please enter an address.');
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                products: cartItems.map((item) => ({
                    id: item?._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                amount: totalPrice.toFixed(2),
                address: address.trim(),
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/order`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                toast.success('Order placed successfully!');
                dispatch(emptyCart());
                setTimeout(() => {
                    navigate('/orders');
                }, 300);
            } else if (res.data.outOfStockItems) {
                setStockErrors(res.data.outOfStockItems);
                toast.error('Some items are out of stock');
            } else {
                toast.error(res.data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Drawer>
                <DrawerTrigger className="relative inline-block">
                    {totalQuantity > 0 && (
                        <Badge className="absolute -top-2 -right-2 text-xs px-1 py-0.5">
                            {totalQuantity}
                        </Badge>
                    )}
                    <ShoppingCart
                        strokeWidth={1.3}
                        size={28}
                        className="text-gray-800 hover:scale-105 transition-all ease-in-out cursor-pointer"
                    />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="text-xl font-bold">Your Cart</DrawerTitle>
                        <DrawerDescription>
                            Total Quantity: {totalQuantity} — Total Price: Rs {totalPrice.toLocaleString()}
                        </DrawerDescription>
                    </DrawerHeader>

                    {stockErrors.length > 0 && (
                        <div className="px-6 py-2 bg-red-50 text-red-700">
                            <p className="font-medium">Stock issues:</p>
                            {stockErrors.map((error, i) => (
                                <p key={i}>{error.name}: Only {error.available} available</p>
                            ))}
                        </div>
                    )}

                    {cartItems.length > 0 ? (
                        cartItems.map((item) => <CartProduct key={item._id} {...item} />)
                    ) : (
                        <p className="text-center text-gray-500 py-6">Your cart is empty.</p>
                    )}

                    {cartItems.length > 0 && (
                        <div className="px-6 py-4">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                                className="border p-2 rounded-md w-full text-sm"
                                required
                            />
                        </div>
                    )}

                    <DrawerFooter>
                        <Button 
                            onClick={handleBuyNow} 
                            disabled={cartItems.length === 0 || isProcessing || stockErrors.length > 0}
                        >
                            {isProcessing ? 'Processing...' : 'Checkout'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default CartDrawer;
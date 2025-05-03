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
import { useSelector } from 'react-redux';
import CartProduct from './CartProduct';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CartDrawer = () => {
    const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
    console.log(cartItems);
    
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [stockErrors, setStockErrors] = useState([]);
   

    const handleBuyNow = async () => {
        if (!user) return navigate('/login');

        if (cartItems.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        setIsProcessing(true);
        navigate('/checkout')


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
                            Total Quantity: {totalQuantity}
                        </DrawerDescription>
                    </DrawerHeader>

                 

                    {/* Display Stock Errors */}
                    {stockErrors.length > 0 && (
                        <div className="px-6 py-2 bg-red-50 text-red-700">
                            <p className="font-medium">Stock issues:</p>
                            {stockErrors.map((error, i) => (
                                <p key={i}>{error.name}: Only {error.available} available</p>
                            ))}
                        </div>
                    )}

                    {/* Display Cart Items */}
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => <CartProduct key={item._id} {...item} />)
                    ) : (
                        <p className="text-center text-gray-500 py-6">Your cart is empty.</p>
                    )}

                    <DrawerFooter>
                        <Button
                            onClick={handleBuyNow}
                            disabled={cartItems.length === 0 || isProcessing || stockErrors.length > 0 }
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

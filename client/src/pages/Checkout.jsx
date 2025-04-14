import CheckoutProduct from '@/components/custom/CheckoutProduct';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react'; // Assuming you're using Shadcn icons
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { emptyCart } from '@/redux/slices/cartSlice';
import axios from 'axios';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (address.trim() === '') {
      return toast('Please enter your address');
    }

    const productArray = cartItems.map((item) => ({
      id: item._id,
      quantity: item.quantity,
    }));

    try {
      setLoading(true); // Set loading to true before the request
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/order`, {
        products: productArray,
        amount: totalPrice.toFixed(2),
        address: address,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        dispatch(emptyCart());
        navigate('/success');
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong!');
      toast.error('Something went wrong!');
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className='mx-auto w-[90vw] sm:w-[60vw] flex justify-between items-center sm:my-20'>
      <div className='flex flex-col sm:flex-row gap-5 mx-auto my-10'>
        {/* Product details */}
        <div className='space-y-8'>
          <div className='p-4 space-y-4'>
            <h2 className='text-xl font-medium '>Order Summary</h2>
            <div className='space-y-1 text-3xl'>
              {
                cartItems.map((item) => <CheckoutProduct key={item._id} {...item} />)
              }
              <hr />
              <div className='p-3 rounded-md'>
                <p className='flex justify-between items-center'>
                  <span>Subtotal:</span>
                  <span>{totalPrice}</span>
                </p>
                <p className='flex justify-between items-center'>
                  <span>Tax:</span>
                  <span>0</span>
                </p>
                <p className='flex justify-between items-center'>
                  <span>Shipping:</span>
                  <span>0</span>
                </p>
              </div>
              <hr />
              <div className='p-3 rounded-md'>
                <p className='flex justify-between items-center'>
                  <span>Total:{totalPrice * totalQuantity}</span>
                  <span>0</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className='w-[90vw] sm:w-[20vw]'>
          <Card className='p-4 shadow-md space-y-4'>
            <h2>Billing Information</h2>
            <div className='space-y-2'>
              <Label htmlFor="name">Full Name</Label>
              <Input id='name' value={user?.name} placeholder='Taimoor' className='w-full' />
              <Label htmlFor="email">Email Address</Label>
              <Input id='email' value={user?.email} placeholder='123@example.com' className='w-full' />
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea onChange={(e) => setAddress(e.target.value)} id='address' placeholder='123 mai city' className='w-full' />
              <Button onClick={handleCheckout} disabled={loading}>Place Order</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full h-full flex items-center justify-center mt-4">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Checkout;

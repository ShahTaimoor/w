import OrderData from '@/components/custom/OrderData';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Assuming you're using Shadcn icons
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_API_URL + '/get-orders-by-user-id', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { data } = await res.data;
        setOrders(data);
      } catch (error) {
        toast.error('Order Error');
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="w-[90vw] lg:w-[50vw] mx-auto my-10 sm:my-32 grid gap-3">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <OrderData key={order._id} {...order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

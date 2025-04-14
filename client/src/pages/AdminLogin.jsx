import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setUserLogin } from '@/redux/slices/authSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Shadcn icon for loader
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Shadcn Alert for errors

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Error state for handling errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error message

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();

    if (!username || !password) {
      setIsLoading(false);
      return toast.error('Both username and password are required');
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin-login`,
        { username, password },
      );

      if (!data.token || !data.user) {
        throw new Error('Invalid server response');
      }

      dispatch(setUserLogin(data));
      toast.success('Admin logged in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to authenticate. Please try again.';
      setError(errorMessage); // Set the error state
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full mx-auto md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
        <div className='flex justify-center mb-6'>
          <h2 className='text-xl font-medium'>Zaryab Auto</h2>
        </div>
        <h2 className='text-2xl font-bold text-center mb-6'>Admin Portal</h2>

        {/* Error Handling with Shadcn Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Username</label>
          <Input
            placeholder='Enter admin username'
            type='text'
            name='username'
            autoComplete='username'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <Input
            placeholder='Enter admin password'
            type='password'
            name='password'
            autoComplete='current-password'
            required
          />
        </div>

        <Button
          type='submit'
          className='w-full mt-4'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin text-white" size={24} /> 
              <span className="ml-2">Authenticating...</span>
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;

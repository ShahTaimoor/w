import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import axios from 'axios'

const Signup = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [inputValue, setInputValues] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    axios
      .post(import.meta.env.VITE_API_URL + '/signup', inputValue, {
        headers: { "Content-Type": "application/json" }
      })
      .then((response) => {
        console.log(response);
        navigate('/login')
      })
      .catch((error) => {
        console.log(error);

      })
  }

  return (
    <div className='w-full mx-auto md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
        <div className='flex justify-center mb-6'>
          <h2 className='text-xl font-medium'>Zaryab Auto</h2>
        </div>
        <h2 className='text-2xl font-bold text-center mb-6'>Hey There!</h2>
        <p className='text-center mb-6'>
          Enter your details to Sign Up
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Name</label>
          <Input onChange={handleChange} placeholder='Enter Your Name' type='text' name='name' value={inputValue.name} />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <Input onChange={handleChange} placeholder='Enter Your Email' type='text' name='email' value={inputValue.email} />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <Input onChange={handleChange} placeholder='Enter Your Password' type='password' name='password' value={inputValue.password} />
        </div>
        <Button className='w-full mt-4' disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Up...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
        <p className='mt-6 text-center text-sm'>
          Already have an account?
          <Link to='/login' className='text-blue-500 ml-1'>Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Signup

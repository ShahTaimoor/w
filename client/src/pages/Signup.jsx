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
  const [enabled, setEnable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password } = e.target.elements

    if (name.value.trim() === '' || email.value.trim() === '' || password.value.trim() === '') {
      toast.error("Please fill all the fields")
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/signup', {
        name: name.value,
        email: email.value,
        password: password.value
      })

      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
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
          <Input placeholder='Enter Your Name' type='text' name='name' />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Email</label>
          <Input placeholder='Enter Your Email' type='email' name='email' />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-semibold mb-2'>Password</label>
          <Input placeholder='Enter Your Password' type='password' name='password' />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            onCheckedChange={(checked) => setEnable(checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <Button className='w-full mt-4' disabled={!enabled || loading}>
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

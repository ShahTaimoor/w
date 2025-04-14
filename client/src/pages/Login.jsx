import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { setUserLogin } from '@/redux/slices/authSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
  const dispatch = useDispatch()
  const [enabled, setEnable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements

    if (email.value.trim() === '' || password.value.trim() === '') {
      toast("Please fill all the fields")
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/login', {
        email: email.value,
        password: password.value
      })

      const data = res.data
      dispatch(setUserLogin(data))
      toast.success('Logged in successfully')
      navigate('/')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      setErrorMsg(errorMessage)
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
          Enter your details to Login
        </p>

        {/* Show Error Message if any */}
        {errorMsg && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

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

        <Button 
          className="w-full mt-4" 
          disabled={!enabled || loading}
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <p className='mt-6 text-center text-sm'>
          I don't have an account?
          <Link to={`/signup`} className='text-blue-500'> Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login

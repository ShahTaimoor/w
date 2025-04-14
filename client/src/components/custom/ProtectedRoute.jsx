import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { pathname } = useLocation()
    // Corrected spelling and added role destructuring
    const { isAuthenticated, user, role } = useSelector((state) => state.auth)
    const { cartItems } = useSelector((state) => state.cart)

    // 1. Prevent authenticated admin from accessing admin login
    if (isAuthenticated && role === 'admin' && pathname === '/admin/login') {
        return <Navigate to='/admin/dashboard' replace />
    }

    // 2. Prevent regular users from accessing admin routes
    if (isAuthenticated && role === 'user' && 
        (pathname.startsWith('/admin/dashboard') || pathname === '/admin/login')) {
        return <Navigate to='/' replace />
    }

    // 3. Protect admin dashboard from unauthenticated users
    if (!isAuthenticated && pathname.startsWith('/admin/dashboard')) {
        return <Navigate to='/' replace />
    }

    // 4. Redirect authenticated users away from auth pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        return <Navigate to='/' replace />
    }

    // 5. Protect orders page from unauthenticated users
    if (!isAuthenticated && pathname === '/orders') {
        return <Navigate to='/login' replace />
    }

    // 6. Prevent empty cart checkout
    if (isAuthenticated && cartItems.length === 0 && pathname === '/checkout') {
        return <Navigate to='/' replace />
    }

    return children
}

export default ProtectedRoute
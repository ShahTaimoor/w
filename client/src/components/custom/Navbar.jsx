import { Link } from "react-router-dom"
import CartDrawer from "./CartDrawer"
import { useState } from "react"
import { User } from "lucide-react"
import LogoutToggle from "./LogoutToggle"
import { useSelector } from "react-redux"



const Navbar = () => {

    const { isAuthenticated, user } = useSelector((state) => state.auth)

    return (
        <nav className="flex justify-between items-center px-8 py-5 border-b">
            {/* Icons */}
            <div className="flex gap-4">
                <CartDrawer />
                {
                    isAuthenticated ? <LogoutToggle user={user} /> : <Link to='/login' className="">
                        <User size={28} strokeWidth={1.3} />
                    </Link>
                }
            </div>

            <Link to='/' className="text-2xl font-bold">Zaryab Auto</Link>

            <ul className="hidden sm:flex gap-2 text-xl ">
                <Link to='/'>About</Link>
                <Link to='/'>Faqs</Link>
            </ul>

        </nav>
    )
}

export default Navbar
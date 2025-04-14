import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUserLogout } from "@/redux/slices/authSlice"


const ToggleLogout = ({ user }) => {
    const dispatch = useDispatch()
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarFallback className='cursor-pointer'>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>

                    <DropdownMenuItem onClick={() => dispatch(setUserLogout())} >Logout</DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to='/orders'>
                            MyOrders
                        </Link>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ToggleLogout
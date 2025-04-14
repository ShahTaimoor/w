import { Calendar, ChartBar, FilePlus2Icon, GalleryVerticalEnd, Home, Inbox, PackageSearch, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useDispatch } from "react-redux"
import { setUserLogout } from "@/redux/slices/authSlice"


const items = [
    {
        title: "Create Products",
        url: "/admin/dashboard",
        icon: FilePlus2Icon,
    },
    {
        title: "All Products",
        url: "/admin/dashboard/all-products",
        icon: GalleryVerticalEnd,
    },
    {
        title: "Orders",
        url: "/admin/dashboard/orders",
        icon: PackageSearch,
    },
    {
        title: "Analytics",
        url: "/admin/dashboard/analytics",
        icon: ChartBar,
    },
    {
        title: "Settings",
        url: "/admin/dashboard/settings",
        icon: Settings,
    },
]



export function AppSidebar() {
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    return (
        <Sidebar>
            <SidebarHeader>
                <h3>Dashboard</h3>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>


                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className={`${pathname === item.url && 'bg-zinc-200'}`}>
                                    <Link to={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button onClick={() => dispatch(setUserLogout())}>
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}

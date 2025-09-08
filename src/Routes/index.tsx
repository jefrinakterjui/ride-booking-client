import App from "@/App";
import DashboardLayout from "@/components/Layouts/DashboardLayout";
import ManageRides from "@/components/Modules/Admin/ManageRides";
import ManageUsers from "@/components/Modules/Admin/ManageUsers";
import About from "@/pages/About";
import Analytics from "@/pages/Admin/Analytics";
import DriverAnalytics from "@/pages/Driver/Analytics";
import Login from "@/pages/Login";
import MyProfile from "@/pages/MyProfile";
import Register from "@/pages/Register";
import RiderAnalytics from "@/pages/Rider/Analytics";
import { createBrowserRouter, Navigate } from "react-router";

export const router = createBrowserRouter([
    {
        path:"/",
        Component:App,
        children:[
            {
                path:"/about",
                Component: About
            },
            {
                path:"/login",
                Component: Login
            },
            {
                path:"/register",
                Component: Register
            }
        ]
    },
    {
        path:"/admin",
        Component: DashboardLayout,
        children:[
            {
                path:"/admin",
                element: <Navigate to={"/admin/analytics"} replace={true}/>
            },
            {
                path:"analytics",
                Component: Analytics
            },
            {
                path:"users",
                Component: ManageUsers
            },
            {
                path:"rides", 
                Component: ManageRides
            },
            {
                path:"profile", 
                Component: MyProfile
            }
        ]
    },
    {
        path:"/driver",
        Component: DashboardLayout,
        children:[
            {
                path:"analytics",
                Component: DriverAnalytics
            }
        ]
    },
    {
        path:"/rider",
        Component: DashboardLayout,
        children:[
            {
                path:"analytics",
                Component: RiderAnalytics
            }
        ]
    }
])
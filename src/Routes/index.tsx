import App from "@/App";
import About from "@/pages/About";
import Analytics from "@/pages/Admin/Analytics";
import DriverAnalytics from "@/pages/Driver/Analytics";
import Login from "@/pages/Login";
import MyProfile from "@/pages/MyProfile";
import Register from "@/pages/Register";
import RiderAnalytics from "@/pages/Rider/Analytics";
import { createBrowserRouter, Navigate } from "react-router";
import DashboardLayout from "@/Components/Layouts/DashboardLayout";
import ManageUsers from "@/Components/Modules/Admin/ManageUsers";
import ManageRides from "@/Components/Modules/Admin/ManageRides";
import ProtectedRoute from "@/Routes/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "/about",
                Component: About
            },
            {
                path: "/login",
                Component: Login
            },
            {
                path: "/register",
                Component: Register
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin",
                element: <Navigate to={"/admin/analytics"} replace={true} />
            },
            {
                path: "analytics",
                Component: Analytics
            },
            {
                path: "users",
                Component: ManageUsers
            },
            {
                path: "rides",
                Component: ManageRides
            },
            {
                path: "profile",
                Component: MyProfile
            }
        ]
    },
    {
        path: "/driver",
        element: (
            <ProtectedRoute allowedRoles={["DRIVER"]}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "analytics",
                Component: DriverAnalytics
            }
        ]
    },
    {
        path: "/rider",
        element: (
            <ProtectedRoute allowedRoles={["RIDER"]}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "analytics",
                Component: RiderAnalytics
            }
        ]
    }
])
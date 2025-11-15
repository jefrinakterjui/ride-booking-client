import { Outlet } from "react-router";
import Navbar from "../Modules/Admin/Navbar";
import { useUserInfoQuery } from "@/redux/freatures/auth/auth.api"; 
import RiderSidebar from "../Modules/Rider/RiderSidebar"; 
import { Skeleton } from "../ui/skeleton";
import AdminSidebar from "../Modules/Admin/AdminSidebar";

const DashboardLayout = () => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const userRole = data?.data?.role;

  const renderSidebar = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col h-full justify-between p-6 border-r space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="h-6 w-1/2" />
        </div>
      )
    }

    switch (userRole) {
      case "ADMIN":
        return <AdminSidebar />;
      case "RIDER":
        return <RiderSidebar />;
      case "DRIVER":
        // return <DriverSidebar />;
      default:
        return <div>Error: Unknown Role</div>; 
    }
  };

  return (
    <div>
      <Navbar />
      <div className=" grid grid-cols-12 ">
        <div className=" h-[calc(100vh-50px)] col-span-2 ">
          {renderSidebar()}
        </div>
        <div className="col-span-10 h-[calc(100vh-50px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
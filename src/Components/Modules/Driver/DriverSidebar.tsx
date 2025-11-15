import { NavLink } from "react-router-dom";
import { BarChart2, History, UserCircle, ArrowLeft, Car, Zap } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/freatures/auth/auth.api";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button"; 
import { toast } from "sonner";
import { Skeleton } from "@/Components/ui/skeleton";
import { useUpdateAvailabilityMutation } from "@/redux/freatures/driver/driver.api";

const sidebarLinks = [
  {
    to: "/driver/analytics",
    icon: <BarChart2 size={20} />,
    label: "Earnings",
  },
  {
    to: "/driver/available-rides",
    icon: <Car size={20} />,
    label: "Available Rides",
  },
  {
    to: "/driver/ride-history",
    icon: <History size={20} />,
    label: "Ride History",
  },
  {
    to: "/driver/profile",
    icon: <UserCircle size={20} />,
    label: "My Profile",
  },
];

const DriverSidebar = () => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const [updateAvailability, { isLoading: isUpdatingStatus }] = useUpdateAvailabilityMutation();

  const currentStatus = userData?.data?.availabilityStatus;
  const isOnline = currentStatus === "ONLINE";
  const handleStatusChange = async (newStatus: boolean) => {
    const newAvailability = newStatus ? "ONLINE" : "OFFLINE";
    const toastId = toast.loading("Updating status...");
    try {
      await updateAvailability({ availabilityStatus: newAvailability }).unwrap();
      toast.success(`You are now ${newAvailability.toLowerCase()}`, { id: toastId });
    } catch (err) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handelLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  return (
    <div className="flex flex-col h-full justify-between p-6 border-r">
      <div>
        {isUserLoading ? (
          <Skeleton className="h-20 w-full mb-6" />
        ) : (
          <div className="flex flex-col gap-3 p-3 rounded-lg bg-accent mb-6">
            <div className="flex items-center gap-2">
              <Zap className={`h-5 w-5 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="font-semibold flex-1">
                {isOnline ? "You are Online" : "You are Offline"}
              </span>
            </div>
            <Button
              variant={isOnline ? "destructive" : "default"}
              size="sm"
              className="w-full"
              onClick={() => handleStatusChange(!isOnline)} 
              disabled={isUpdatingStatus}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </Button>
          </div>
        )}
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <h1
        onClick={handelLogout}
        className="text-sm flex gap-4 cursor-pointer select-none w-full items-center justify-start hover:text-primary transition-colors"
      >
        <ArrowLeft className="text-xs" /> Logout
      </h1>
    </div>
  );
};

export default DriverSidebar;
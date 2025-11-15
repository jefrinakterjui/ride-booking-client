import { NavLink } from "react-router";
import { BarChart2, UserCircle, ArrowLeft, History } from "lucide-react";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/freatures/auth/auth.api";
import { useDispatch } from "react-redux";

const sidebarLinks = [
    {
        to: "/rider/analytics",
        icon: <BarChart2 size={20} />,
        label: "Dashboard",
    },
    {
        to: "/rider/ride-history",
        icon: <History size={20} />,
        label: "Ride History",
    },
    {
        to: "/rider/profile",
        icon: <UserCircle size={20} />,
        label: "My Profile",
    },
];

const Sidebar = () => {
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  console.log(data?.data);

  const handelLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  return (
    <div className="flex flex-col h-full justify-between p-6 border-r">
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

      <h1
        onClick={handelLogout}
        className="text-sm flex gap-4 cursor-pointer select-none w-full items-center justify-start"
      >
        <ArrowLeft className="text-xs" /> Logout
      </h1>
    </div>
  );
};

export default Sidebar;

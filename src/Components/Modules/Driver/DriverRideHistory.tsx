import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ListFilter, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetDriverRideHistoryQuery } from '@/redux/freatures/driver/driver.api';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar'; 

const rideStatuses = ["ALL", "accepted", "in_transit", "completed", "cancelled"];

const DriverRideHistory = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const queryParams: { page: number; limit: number; status?: string; startDate?: string; endDate?: string } = {
    page,
    limit: 10,
  };

  if (statusFilter !== "ALL") {
    queryParams.status = statusFilter;
  }
  if (dateFilter) {
    queryParams.startDate = dateFilter;
    queryParams.endDate = dateFilter;
  }

  const { data, isLoading, isError } = useGetDriverRideHistoryQuery(queryParams);

  const rides = data?.data || [];
  const meta = data?.meta;

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setPage((prev) => (meta && prev * meta.limit < meta.total ? prev + 1 : prev));
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'in_transit':
      case 'accepted': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Ride History</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-lg font-semibold">Filter Rides</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="date"
                className="pl-10"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListFilter size={16} />
                  <span>Status: <span className="font-semibold">{statusFilter}</span></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {rideStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => {
                      setStatusFilter(status);
                      setPage(1); 
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Rider</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500 font-medium py-10">
                  Failed to load ride history.
                </TableCell>
              </TableRow>
            ) : rides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 font-medium py-10">
                  No rides found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              rides.map((ride) => (
                <TableRow key={ride._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{ride.riderId?.name?.charAt(0) || 'R'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{ride.riderId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{ride.riderId?.email || 'N/A'}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(ride.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(ride.status)}>{ride.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {ride.fare ? `৳${ride.fare}` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {meta && meta.total > meta.limit && (
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-gray-600">
            Page {meta.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page === totalPages || !meta || meta.total <= page * meta.limit}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DriverRideHistory;
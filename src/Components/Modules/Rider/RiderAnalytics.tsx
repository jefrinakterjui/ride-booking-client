import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, History } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { useCreateRideMutation, useGetMyRideHistoryQuery } from "@/redux/ride.api";
import { Skeleton } from "@/Components/ui/skeleton";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const RiderAnalytics = () => {
  const [createRide, { isLoading: isRequestingRide }] = useCreateRideMutation();
  const { data: historyData, isLoading: isHistoryLoading } = useGetMyRideHistoryQuery(undefined);
  const stats = {
    totalRides: historyData?.meta?.total || 0,
    totalSpent: historyData?.data?.reduce((acc: number, ride: any) =>
        ride?.status === "completed" ? acc + (Number(ride?.fare) || 0) : acc, 0) || 0,
  };

  const recentRides = historyData?.data?.slice(0, 3) || [];

  const handleRideRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ridePayload = {
      pickupLocation: { lat: 23.7461, lng: 90.3742 }, 
      destinationLocation: { lat: 23.7925, lng: 90.4078 },
    };

    const toastId = toast.loading("Finding a driver for you...");

    try {
      await createRide(ridePayload).unwrap();
      toast.success("Ride requested successfully! Driver is on the way.", {
        id: toastId,
      });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      let errorMessage = "Failed to request ride.";
      if (
        err?.data?.errorSource &&
        err.data.errorSource.length > 0
      ) {
        errorMessage = err.data.errorSource[0].message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isHistoryLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <StatCard
              icon={<History className="text-blue-500" />}
              title="Total Rides"
              value={stats.totalRides}
            />
            <StatCard
              icon={<DollarSign className="text-green-500" />}
              title="Total Spent"
              value={`৳${stats.totalSpent}`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Where to?</CardTitle>
            <CardDescription>
              Request a ride right from your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRideRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-base">
                  Pickup Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="pickup"
                    placeholder="Enter pickup location (e.g., Dhanmondi)"
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-base">
                  Destination
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Enter destination (e.g., Gulshan)"
                    className="pl-10 text-base h-12"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4">
                <div className="text-lg font-bold text-gray-700">
                  Estimated Fare: <span className="text-primary text-xl">৳220</span>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto h-12 text-base"
                  disabled={isRequestingRide} 
                >
                  {isRequestingRide ? "Requesting..." : "Request Ride Now"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRides.map((ride) => (
                    <TableRow key={ride._id}>
                      <TableCell>
                        <Badge
                          variant={
                            ride.status === "completed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell>৳{ride.fare || "N/A"}</TableCell>
                       <TableCell>
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Button variant="link" className="p-0 mt-4">
              View All Ride History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiderAnalytics;
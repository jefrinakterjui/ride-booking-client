import {
  useGetAvailableRidesQuery,
  useAcceptRideMutation,
} from '@/redux/freatures/ride/ride.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/Components/ui/skeleton';
import { MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';


const RideCard = ({ ride, onAccept, isLoading }: { ride: any, onAccept: (id: string) => void, isLoading: boolean }) => {
  
  const pickupAddress = `Pickup (Lat: ${ride.pickupLocation.lat}, Lng: ${ride.pickupLocation.lng})`;
  const destinationAddress = `Destination (Lat: ${ride.destinationLocation.lat}, Lng: ${ride.destinationLocation.lng})`;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>New Ride Request</span>
          <span className="text-lg font-bold text-primary">
            {ride.fare ? `৳${ride.fare}` : '(Fare TBD)'}
          </span>
        </CardTitle>
        <CardDescription>
          From Rider: {ride.riderId?.name || 'Unknown User'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-1" />
          <div>
            <p className="font-semibold">Pickup</p>
            <p className="text-sm text-gray-600">{pickupAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-1" />
          <div>
            <p className="font-semibold">Destination</p>
            <p className="text-sm text-gray-600">{destinationAddress}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onAccept(ride._id)}
          disabled={isLoading}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isLoading ? 'Accepting...' : 'Accept Ride'}
        </Button>
      </CardFooter>
    </Card>
  );
};


const AvailableRides = () => {
  const { data, isLoading, isError } = useGetAvailableRidesQuery(undefined, {
    pollingInterval: 15000,
  });
  
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();

  const availableRides = data?.data || [];

  const handleAcceptRide = async (rideId: string) => {
    const toastId = toast.loading("Accepting ride...");
    try {
      await acceptRide(rideId).unwrap();
      toast.success("Ride accepted successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept ride", { id: toastId });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <CardHeader>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))
      );
    }

    if (isError) {
      return (
        <p className="text-red-500 lg:col-span-3">
          Failed to load available rides.
        </p>
      );
    }

    if (availableRides.length === 0) {
      return (
        <div className="lg:col-span-3 text-center py-20 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-500">
            No available rides right now.
          </h2>
          <p className="text-gray-400">Make sure you are "Online" to receive requests.</p>
        </div>
      );
    }

    return availableRides.map((ride) => (
      <RideCard 
        key={ride._id} 
        ride={ride} 
        onAccept={handleAcceptRide}
        isLoading={isAccepting}
      />
    ));
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Ride Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AvailableRides;
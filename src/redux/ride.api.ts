import { baseApi } from "@/redux/baseApi";

type TLocation = {
  lat: number;
  lng: number;
};
type TCreateRidePayload = {
  pickupLocation: TLocation;
  destinationLocation: TLocation;
};

interface IRide {
  _id: string;
  riderId: string;
  driverId?: string;
  pickupLocation: TLocation;
  destinationLocation: TLocation;
  status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
  fare?: number;
  createdAt: string;
}

interface IHistoryResponse {
  success: boolean;
  message: string;
  data: IRide[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRide: builder.mutation({
      query: (rideData: TCreateRidePayload) => ({
        url: "/rides/request",
        method: "POST",
        data: rideData,
      }),
      invalidatesTags: ["Rides"], 
    }),

    getMyRideHistory: builder.query<IHistoryResponse, void>({
      query: () => ({
        url: "/rides/my-history",
        method: "GET",
      }),
      providesTags: ["Rides"],
    }),
  }),
});

export const { 
  useCreateRideMutation, 
  useGetMyRideHistoryQuery 
} = rideApi;
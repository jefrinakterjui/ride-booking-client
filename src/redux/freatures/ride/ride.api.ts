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

interface IHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
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

    getMyRideHistory: builder.query<IHistoryResponse, IHistoryParams | void>({
      query: (params) => ({
        url: "/rides/my-history",
        method: "GET",
        params: params || {}, 
      }),
      providesTags: ["Rides"],
    }),
  }),
});

export const { 
  useCreateRideMutation, 
  useGetMyRideHistoryQuery 
} = rideApi;
import { baseApi } from "@/redux/baseApi";

type TAvailabilityStatus = "ONLINE" | "OFFLINE";

interface IDriverEarnings {
  success: boolean;
  message: string;
  data: {
    totalEarnings: number;
    totalRides: number;
  };
}

interface IDriverHistoryResponse {
  success: boolean;
  message: string;
  data: any[];
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
}

interface IMonthlyEarnings {
  success: boolean;
  message: string;
  data: {
    month: string; 
    earnings: number;
    rides: number;
  }[];
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAvailability: builder.mutation<any, { availabilityStatus: TAvailabilityStatus }>({
      query: (data) => ({
        url: "/drivers/me/availability",
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["USER"], 
    }),

    getDriverEarnings: builder.query<IDriverEarnings, void>({
      query: () => ({
        url: "/drivers/me/earnings",
        method: "GET",
      }),
      providesTags: ["Rides"], 
    }),
    getDriverRideHistory: builder.query<IDriverHistoryResponse, IHistoryParams | void>({
      query: (params) => ({
        url: "/drivers/me/history",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Rides"],
    }),
    getMonthlyEarnings: builder.query<IMonthlyEarnings, void>({
      queryFn: async () => {
        const demoData = [
          { month: "Jan", earnings: 250, rides: 20 },
          { month: "Feb", earnings: 290, rides: 40 },
          { month: "Mar", earnings: 260, rides: 45 },
          { month: "Apr", earnings: 410, rides: 160 },
          { month: "May", earnings: 450, rides: 170 },
          { month: "Jun", earnings: 520, rides: 280 },
          { month: "Jul", earnings: 420, rides: 200 },
          { month: "Aug", earnings: 360, rides: 110 },
          { month: "Sep", earnings: 420, rides: 170 },
          { month: "Oct", earnings: 280, rides: 30 },
          { month: "Nov", earnings: 480, rides: 180 },
          { month: "Dec", earnings: 490, rides: 240 },
        ];
        return { data: { success: true, message: "Demo monthly data", data: demoData } };
      },
      providesTags: ["Rides"],
    }),
  }),
});

export const {
  useUpdateAvailabilityMutation,
  useGetDriverEarningsQuery,
  useGetDriverRideHistoryQuery,
  useGetMonthlyEarningsQuery,
} = driverApi;
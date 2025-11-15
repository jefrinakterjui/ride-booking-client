import { baseApi } from "@/redux/baseApi";

type TUpdateProfilePayload = {
  name?: string;
  vehicleInfo?: {
    vehicleType: string;
    model: string;
  };
};

type TChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) =>({
        register: builder.mutation({
            query: (userInfo) =>({
                url: "/user/register",
                method: "POST",
                data: userInfo
            })
        }),
        login: builder.mutation({
            query: (userInfo)=> ({
                url: "/auth/login",
                method: "POST",
                data: userInfo
            }),
            invalidatesTags: ["USER"],
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
            providesTags: ["USER"],
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["USER"],
        }),
        updateMyProfile: builder.mutation({
            query: (data: TUpdateProfilePayload) => ({
                url: "/user/me",
                method: "PATCH",
                data: data,
            }),
            invalidatesTags: ["USER"], 
        }),
        changePassword: builder.mutation({
            query: (data: TChangePasswordPayload) => ({
                url: "/user/change-password",
                method: "PATCH",
                data: data,
            }),
        }),
    })
});

export const { useRegisterMutation , useLoginMutation, useUserInfoQuery, useLogoutMutation, useUpdateMyProfileMutation, useChangePasswordMutation } = authApi
import { api } from "./api";

export const staffApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStaff: builder.mutation({
      query: (body) => ({
        url: "/staff/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    loginStaff: builder.mutation({
      query: (body) => ({
        url: "/staff/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    editStaff: builder.mutation({
      query: (body) => ({
        url: "/staff/edit",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    editStaffPassword: builder.mutation({
      query: (body) => ({
        url: "/staff/edit/password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
    getStaff: builder.query({
      query: () => ({
        url: "/staff/get",
      }),
      providesTags: ["Staff"],
    }),
  }),
});

export const {
  useCreateStaffMutation,
  useLoginStaffMutation,
  useEditStaffMutation,
  useEditStaffPasswordMutation,
  useGetStaffQuery,
} = staffApi;

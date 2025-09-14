import { api } from "./api";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (body) => ({ url: "/subscription/create", method: "POST", body }),
      invalidatesTags: ["Subscription"],
    }),
    getSubscription: builder.query({
      query: () => ({ url: "/subscription/get" }),
      providesTags: ["Subscription"],
    }),
    editSubscription: builder.mutation({
      query: (body) => ({ url: "/subscription/edit", method: "PUT", body }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useEditSubscriptionMutation,
} = subscriptionApi;

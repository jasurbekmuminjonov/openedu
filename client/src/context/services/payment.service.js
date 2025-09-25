import { api } from "./api";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (body) => ({ url: "/payment/create", method: "POST", body }),
      invalidatesTags: ["Payment"],
    }),
    getPayment: builder.query({
      query: ({ student_id } = {}) => ({
        url: student_id
          ? `/payment/get?student_id=${student_id}`
          : "/payment/get",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useCreatePaymentMutation, useGetPaymentQuery } = paymentApi;

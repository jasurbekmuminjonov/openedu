import { api } from "./api";

export const salaryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSalary: builder.mutation({
      query: (body) => ({ url: "/salary/create", method: "POST", body }),
      invalidatesTags: ["Salary"],
    }),
    getSalary: builder.query({
      query: () => ({ url: "/salary/get" }),
      providesTags: ["Salary"],
    }),
    deleteSalary: builder.mutation({
      query: (body) => ({ url: "/salary/delete", method: "DELETE", body }),
      invalidatesTags: ["Salary"],
    }),
  }),
});

export const {
  useCreateSalaryMutation,
  useGetSalaryQuery,
  useDeleteSalaryMutation,
} = salaryApi;

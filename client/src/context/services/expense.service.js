import { api } from "./api";

export const expenseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createExpenseCategory: builder.mutation({
      query: (body) => ({
        url: "/expense/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),
    getExpenseCategory: builder.query({
      query: () => ({ url: "/expense/category" }),
      providesTags: ["ExpenseCategory"],
    }),
    deleteExpenseCategory: builder.mutation({
      query: (body) => ({
        url: "/expense/category/delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["ExpenseCategory"],
    }),
    createExpense: builder.mutation({
      query: (body) => ({ url: "/expense/create", method: "POST", body }),
      invalidatesTags: ["Expense"],
    }),
    getExpense: builder.query({
      query: () => ({ url: "/expense" }),
      providesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation({
      query: (body) => ({ url: "/expense/delete", method: "DELETE", body }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const {
  useCreateExpenseCategoryMutation,
  useGetExpenseCategoryQuery,
  useDeleteExpenseCategoryMutation,
  useCreateExpenseMutation,
  useGetExpenseQuery,
  useDeleteExpenseMutation,
} = expenseApi;

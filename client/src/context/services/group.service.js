import { api } from "./api";

export const groupApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (body) => ({ url: "/group/create", method: "POST", body }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query({
      query: () => ({ url: "/group/get" }),
      providesTags: ["Group"],
    }),
    getGroupByQuery: builder.query({
      query: ({ teacher_id, subject_id, subscription_id, id, student_id }) => ({
        url: `/group/query?teacher_id=${teacher_id}&subject_id=${subject_id}&subscription_id=${subscription_id}&student_id=${student_id}&id=${id}`,
      }),
      providesTags: ["Group"],
    }),

    editGroup: builder.mutation({
      query: (body) => ({ url: "/group/edit", method: "PUT", body }),
      invalidatesTags: ["Group", "Student"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupQuery,
  useEditGroupMutation,
  useGetGroupByQueryQuery,
} = groupApi;

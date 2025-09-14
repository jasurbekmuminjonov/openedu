import { api } from "./api";

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation({
      query: (body) => ({
        url: "/student/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    editStudent: builder.mutation({
      query: (body) => ({
        url: "/student/edit",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    getStudent: builder.query({
      query: () => ({
        url: "/student/get",
      }),
      providesTags: ["Student"],
    }),
    getStudentByQuery: builder.query({
      query: ({ group_id, id, q }) => ({
        url: `/student/query?group_id=${group_id || ""}&id=${id || ""}&q=${
          q || ""
        }`,
      }),
      providesTags: ["Student"],
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useEditStudentMutation,
  useGetStudentQuery,
  useGetStudentByQueryQuery,
  useLazyGetStudentByQueryQuery,
} = studentApi;

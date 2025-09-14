import { api } from "./api";

export const teacherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTeacher: builder.mutation({
      query: (body) => ({ url: "/teacher/create", method: "POST", body }),
      invalidatesTags: ["Teacher"],
    }),
    getTeacher: builder.query({
      query: () => ({ url: "/teacher/get" }),
      providesTags: ["Teacher"],
    }),
  }),
});

export const { useCreateTeacherMutation, useGetTeacherQuery } = teacherApi;

import { api } from "./api";

export const subjectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubject: builder.mutation({
      query: (body) => ({ url: "/subject/create", method: "POST", body }),
      invalidatesTags: ["Subject"],
    }),
    getSubject: builder.query({
      query: () => ({ url: "/subject/get" }),
      providesTags: ["Subject"],
    }),
  }),
});

export const { useCreateSubjectMutation, useGetSubjectQuery } = subjectApi;

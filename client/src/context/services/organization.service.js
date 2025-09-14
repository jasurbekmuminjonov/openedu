import { api } from "./api";

export const organizationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (body) => ({ url: "/organization/create", method: "POST", body }),
      invalidatesTags: ["Organization"],
    }),
    loginOrganization: builder.mutation({
      query: (body) => ({ url: "/organization/login", method: "POST", body }),
      invalidatesTags: ["Organization"],
    }),
    editOrganization: builder.mutation({
      query: (body) => ({ url: "/organization/edit", method: "PUT", body }),
      invalidatesTags: ["Organization"],
    }),
    editOrganizationPassword: builder.mutation({
      query: (body) => ({
        url: "/organization/edit/password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),
    terminateOrganization: builder.mutation({
      query: (body) => ({
        url: "/organization/terminate",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useLoginOrganizationMutation,
  useEditOrganizationMutation,
  useEditOrganizationPasswordMutation,
  useTerminateOrganizationMutation,
} = organizationApi;

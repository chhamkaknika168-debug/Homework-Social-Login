import { apiSlice } from "../api/apiSlice";

export const fileSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation({
      query: (formdata) => ({
        url: `/medias/upload-multiple`,
        method: "POST",
        body: formdata, // auto convert to JSON data
      }),
    }),
  }),
});

export const { useUploadFileMutation } = fileSlice;

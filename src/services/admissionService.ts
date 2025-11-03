import { $clientPrivate } from "@/lib/api-client";

export const admissionService = {
  getApplications: async (params: any) => {
    const response = await $clientPrivate.get("/admin/admission/list", { params });
    return response.data;
  },

  getStats: async () => {
    const response = await $clientPrivate.get("/admin/admission/stats");
    return response.data;
  },

  updateApplicationStatus: async (id: number, data: any) => {
    const response = await $clientPrivate.put(`/admin/admission/update-status/${id}`, data);
    return response.data;
  },

  deleteApplication: async (id: number) => {
    const response = await $clientPrivate.delete(`/admin/admission/delete/${id}`);
    return response.data;
  },

  exportApplications: async () => {
    const response = await $clientPrivate.get("/admin/admission/export", {
      responseType: "blob",
    });
    return response.data;
  },
};

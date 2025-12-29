import axiosInstance from "@/utils/axios";

interface Collection {
  value: string;
  label: string;
}

export const optionsApi = {
  getRoles: async (): Promise<Collection[]> => {
    const response = await axiosInstance.get("/roles/options");
    return response.data.data.collection;
  }
};

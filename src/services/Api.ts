import ApiClient from "./ApiClient";

interface ApiProps {
  url: string;
  showLog?: boolean;
  body?: any;
  params?: any;
}

export const Api = {
  get: async ({ url, params = {}, showLog }: ApiProps) => {
    try {
      if (showLog) {
        console.log("API URL", url);
        console.log("API PARAMS", params);
      }

      const res = await ApiClient.get(url, { params });

      if (showLog) console.log("API RES", res);

      return res?.data;
    } catch (error: any) {
      if (showLog) console.log("API ERROR", error);

      if (error?.response?.data?.message)
        error.message = error?.response?.data?.message;

      throw error;
    }
  },

  post: async ({ url, body = {}, showLog }: ApiProps) => {
    try {
      if (showLog) console.log("API BODY", body);

      const res = await ApiClient.post(url, body);

      if (showLog) console.log("API RES", res?.data);

      if (res?.data?.errors) {
        throw res?.data?.errors[0];
      }

      return res?.data;
    } catch (error: any) {
      if (showLog) console.log("API ERROR", error);

      if (error?.response?.data?.message)
        error.message = error?.response?.data?.message;

      throw error;
    }
  },

  put: async ({ url, body = {}, showLog }: ApiProps): Promise<any> => {
    try {
      if (showLog) console.log("API BODY", body);

      const res = await ApiClient.put(url, body);

      if (showLog) console.log("API RES", res?.data);

      return res?.data;
    } catch (error: any) {
      if (showLog) console.log("API ERROR", error);

      if (error?.response?.data?.message) {
        error.message = error?.response?.data?.message;
      }

      throw error;
    }
  },


  delete: async ({ url, showLog }: ApiProps): Promise<any> => {
    try {
      if (showLog) {
        console.log("API URL", url);
      }

      const res = await ApiClient.delete(url);

      if (showLog) console.log("API RES", res?.data);

      return res?.data;
    } catch (error: any) {
      if (showLog) console.log("API ERROR", error);

      if (error?.response?.data?.message) {
        error.message = error?.response?.data?.message;
      }

      throw error;
    }
  },

  patch: async ({ url, body = {}, showLog }: ApiProps): Promise<any> => {
    try {
      if (showLog) console.log("API BODY", body);

      const res = await ApiClient.patch(url, body);

      if (showLog) console.log("API RES", res?.data);

      return res?.data;
    } catch (error: any) {
      if (showLog) console.log("API ERROR", error);

      if (error?.response?.data?.message) {
        error.message = error?.response?.data?.message;
      }

      throw error;
    }
  },
};

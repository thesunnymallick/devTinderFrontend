import axios, { AxiosError } from "axios";

// Change this if your backend runs elsewhere (e.g. via .env -> import.meta.env.VITE_API_BASE_URL)
export const BASE_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends/receives the httpOnly auth cookie set by the backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize every error into a plain Error with a readable message,
// so callers can just do `err.message` regardless of failure type.
interface ApiErrorBody {
  message?: string;
  error?: string;
  data?: { message?: string; error?: string };
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody | string>) => {
    if (error.response) {
      // The backend isn't consistent about wrapping errors in `data` (signup/login
      // return { message, error } at the top level; logout/forgotPassword wrap it
      // in { data: { message, error } }) — so check every shape.
      const body = error.response.data;
      const message =
        (typeof body === "string" && body) ||
        (typeof body === "object" &&
          (body?.error || body?.message || body?.data?.error || body?.data?.message)) ||
        "Something went wrong. Please try again.";
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      // Request was made but no response received (server down, CORS, offline, etc.)
      return Promise.reject(
        new Error("Unable to reach the server. Please check your connection and try again.")
      );
    }

    return Promise.reject(new Error(error.message || "Something went wrong."));
  }
);

export default axiosInstance;
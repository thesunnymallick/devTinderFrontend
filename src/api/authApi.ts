import axiosInstance from "../utils/axiosInstance";

export interface SignupPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
}

export interface LoginPayload {
  emailId: string;
  password: string;
}

export interface AuthUser {
  _id?: string;
  firstName: string;
  lastName: string;
  emailId: string;
  [key: string]: unknown;
}

/** POST /auth/signup */
export const signupApi = async (payload: SignupPayload): Promise<AuthUser> => {
  const response = await axiosInstance.post("/auth/signup", payload);
  return (response.data?.data ?? response.data) as AuthUser;
};

/** POST /auth/login */
export const loginApi = async (payload: LoginPayload): Promise<AuthUser> => {
  const response = await axiosInstance.post("/auth/login", payload);
  return (response.data?.data ?? response.data) as AuthUser;
};

/** POST /auth/logout */
export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

/**
 * GET /profile/view
 * Used on app load to check if the existing auth cookie is still valid.
 * Update the path here if your backend exposes a different "who am I" route.
 */
export const fetchCurrentUserApi = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get("/profile/view");
  return (response.data?.data ?? response.data) as AuthUser;
};
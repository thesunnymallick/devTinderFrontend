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
  age?: number;
  gender?: string;
  bio?: string;
  photoUrl?: string;
  skills?: string[];
  [key: string]: unknown;
}

/**
 * POST /auth/signup
 * Backend only creates the user and returns a success message —
 * it does NOT set a cookie or return the user object here.
 */
export const signupApi = async (payload: SignupPayload): Promise<string> => {
  const response = await axiosInstance.post("/auth/signup", payload);
  const body = response.data?.data ?? response.data;
  return body?.message ?? "Account created successfully";
};

/**
 * POST /auth/login
 * Sets the auth cookie via res.cookie("token", ...), but the response body
 * itself has no user object — just { code, success, message }.
 */
export const loginApi = async (payload: LoginPayload): Promise<string> => {
  const response = await axiosInstance.post("/auth/login", payload);
  const body = response.data?.data ?? response.data;
  return body?.message ?? "Logged in successfully";
};

/** POST /auth/logout */
export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

/**
 * GET /profile/view
 * viewProfileController responds with { data: { code, success, message, user } } —
 * the user object is nested under `user`, not the body itself.
 */
export const fetchCurrentUserApi = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get("/profile/view");
  const body = response.data?.data ?? response.data;
  return body?.user as AuthUser;
};
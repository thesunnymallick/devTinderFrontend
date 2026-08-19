import axiosInstance from "../utils/axiosInstance";
import type { AuthUser } from "./authApi";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  skills?: string[];
  bio?: string;
  age?: number;
  gender?: string;
}

/**
 * PATCH /profile/edit
 * Your profile routes file wasn't shared, so this path/method is a guess
 * based on the devTinder-style convention (updateProfileController reads
 * from req.body, no route param). Update this if your actual route differs —
 * e.g. PUT /profile/update.
 */
export const updateProfileApi = async (payload: UpdateProfilePayload): Promise<AuthUser> => {
  const response = await axiosInstance.patch("/profile/edit", payload);
  const body = response.data?.data ?? response.data;
  return body?.user as AuthUser;
};
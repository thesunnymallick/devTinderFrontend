import axiosInstance from "../utils/axiosInstance";

export interface FeedUser {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  bio?: string;
  skills?: string[];
  gender?: string;
  photoUrl?: string;
}

export interface FeedPagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FeedResponse {
  users: FeedUser[];
  pagination: FeedPagination | null;
}

/** GET /feed — response is { data: { users, pagination } } */
export const fetchFeedApi = async (page = 1, limit = 10): Promise<FeedResponse> => {
  const response = await axiosInstance.get("/feed", { params: { page, limit } });
  const body = response.data?.data ?? response.data;
  return {
    users: body?.users ?? [],
    pagination: body?.pagination ?? null,
  };
};
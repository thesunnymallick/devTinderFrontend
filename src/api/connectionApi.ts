import axiosInstance from "../utils/axiosInstance";

export type SendConnectionStatus = "INTERESTED" | "IGNORED";
export type ReviewConnectionStatus = "ACCEPTED" | "REJECTED";

/** POST /connection/send/:status/:userId — swipe right = INTERESTED, swipe left = IGNORED */
export const sendConnectionApi = async (
  status: SendConnectionStatus,
  userId: string
): Promise<string> => {
  const response = await axiosInstance.post(`/connection/send/${status}/${userId}`);
  const body = response.data?.data ?? response.data;
  return body?.message ?? "Done";
};

/** POST /connection/review/:status/:requestId — accept/reject an incoming request */
export const reviewConnectionApi = async (
  status: ReviewConnectionStatus,
  requestId: string
): Promise<string> => {
  const response = await axiosInstance.post(`/connection/review/${status}/${requestId}`);
  const body = response.data?.data ?? response.data;
  return body?.message ?? "Done";
};

export interface ConnectionUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  age?: number;
  bio?: string;
  skills?: string[];
  [key: string]: unknown;
}

export interface PendingConnection {
  requestId: string;
  status: string;
  type: "SENT" | "RECEIVED";
  user: ConnectionUserSummary;
  createdAt: string;
}

/** GET /connection/requests/pending */
export const fetchPendingConnectionsApi = async (): Promise<PendingConnection[]> => {
  const response = await axiosInstance.get("/connection/requests/pending");
  const body = response.data?.data ?? response.data;
  return body?.data ?? [];
};

export interface AcceptedConnection {
  user: ConnectionUserSummary;
  connectionId: string;
  connectedAt: string;
}

/** GET /connection/connections */
export const fetchAcceptedConnectionsApi = async (): Promise<AcceptedConnection[]> => {
  const response = await axiosInstance.get("/connection/connections");
  const body = response.data?.data ?? response.data;
  return body?.data ?? [];
};
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchPendingConnections,
  reviewConnection,
  clearConnectionError,
} from "../../store/connectionSlice";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Avatar: React.FC<{ firstName: string; lastName: string; photoUrl?: string }> = ({
  firstName,
  lastName,
  photoUrl,
}) => (
  <div className="w-11 h-11 rounded-full bg-[#18181B] overflow-hidden flex items-center justify-center text-slate-500 font-semibold shrink-0">
    {photoUrl ? (
      <img src={photoUrl} alt={firstName} className="w-full h-full object-cover" />
    ) : (
      <>
        {firstName?.[0]}
        {lastName?.[0]}
      </>
    )}
  </div>
);

const Requests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pending, loadingPending, reviewingId, error } = useAppSelector(
    (state) => state.connections
  );

  useEffect(() => {
    dispatch(fetchPendingConnections());
  }, [dispatch]);

  const received = pending.filter((p) => p.type === "RECEIVED");
  const sent = pending.filter((p) => p.type === "SENT");

  return (
    <DashboardLayout>
      <div className="max-w-2xl w-full mx-auto p-5 space-y-8">
        {error && (
          <div className="flex items-center justify-between gap-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => dispatch(clearConnectionError())}
              className="text-red-400 text-sm font-bold"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Received requests */}
        <section>
          <h2 className="text-white font-semibold mb-3">Requests received</h2>

          {loadingPending && received.length === 0 && (
            <p className="text-slate-400 text-sm">Loading...</p>
          )}
          {!loadingPending && received.length === 0 && (
            <p className="text-slate-500 text-sm">No pending requests right now.</p>
          )}

          <div className="space-y-3">
            {received.map((req) => (
              <div
                key={req.requestId}
                className="flex items-center gap-3 p-3 bg-[#141418] border border-[#2A2A35] rounded-xl"
              >
                <Avatar
                  firstName={req.user.firstName}
                  lastName={req.user.lastName}
                  photoUrl={req.user.photoUrl}
                />
                <p className="flex-1 text-white text-sm font-medium">
                  {req.user.firstName} {req.user.lastName}
                </p>
                <button
                  disabled={reviewingId === req.requestId}
                  onClick={() =>
                    dispatch(reviewConnection({ requestId: req.requestId, status: "REJECTED" }))
                  }
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 border border-[#2A2A35] rounded-lg hover:bg-[#18181B] disabled:opacity-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  disabled={reviewingId === req.requestId}
                  onClick={() =>
                    dispatch(reviewConnection({ requestId: req.requestId, status: "ACCEPTED" }))
                  }
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#8B5CF6] rounded-lg hover:bg-[#7C5CFF] disabled:opacity-50 transition-colors"
                >
                  {reviewingId === req.requestId ? "..." : "Accept"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sent requests */}
        <section>
          <h2 className="text-white font-semibold mb-3">Requests sent</h2>

          {!loadingPending && sent.length === 0 && (
            <p className="text-slate-500 text-sm">You haven't sent any requests yet.</p>
          )}

          <div className="space-y-3">
            {sent.map((req) => (
              <div
                key={req.requestId}
                className="flex items-center gap-3 p-3 bg-[#141418] border border-[#2A2A35] rounded-xl"
              >
                <Avatar
                  firstName={req.user.firstName}
                  lastName={req.user.lastName}
                  photoUrl={req.user.photoUrl}
                />
                <p className="flex-1 text-white text-sm font-medium">
                  {req.user.firstName} {req.user.lastName}
                </p>
                <span className="text-xs text-slate-500">Pending</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Requests;
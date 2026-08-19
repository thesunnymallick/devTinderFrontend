import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAcceptedConnections } from "../../store/connectionSlice";
import NavBar from "../../components/shared/NavBar";

const Connections: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accepted, loadingAccepted } = useAppSelector((state) => state.connections);

  useEffect(() => {
    dispatch(fetchAcceptedConnections());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-2xl w-full mx-auto p-5">
        <h2 className="text-white font-semibold mb-4">Your matches</h2>

        {loadingAccepted && accepted.length === 0 && (
          <p className="text-slate-400 text-sm">Loading...</p>
        )}
        {!loadingAccepted && accepted.length === 0 && (
          <p className="text-slate-500 text-sm">
            No matches yet — go swipe on some developers!
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {accepted.map((c) => (
            <div
              key={c.connectionId}
              className="p-4 bg-[#141418] border border-[#2A2A35] rounded-xl flex flex-col items-center text-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-[#18181B] overflow-hidden flex items-center justify-center text-slate-500 font-semibold text-lg">
                {c.user.photoUrl ? (
                  <img
                    src={c.user.photoUrl}
                    alt={c.user.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {c.user.firstName?.[0]}
                    {c.user.lastName?.[0]}
                  </>
                )}
              </div>
              <p className="text-white text-sm font-medium">
                {c.user.firstName} {c.user.lastName}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Connections;
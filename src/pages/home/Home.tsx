import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFeed, swipeUser, removeUserFromFeed, clearSwipeError } from "../../store/feedSlice";
import SwipeCard from "../../components/SwipeCard";
import NavBar from "../../components/shared/NavBar";

const VISIBLE_STACK_SIZE = 3;

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, swipeError, pagination } = useAppSelector(
    (state) => state.feed
  );

  const [pendingDirection, setPendingDirection] = useState<"left" | "right" | null>(null);

  // Initial load
  useEffect(() => {
    dispatch(fetchFeed(1));
  }, [dispatch]);

  // Quietly top up the stack before it runs dry
  useEffect(() => {
    if (!loading && users.length <= 2 && pagination?.hasNextPage) {
      dispatch(fetchFeed(Number(pagination.page) + 1));
    }
  }, [users.length, loading, pagination, dispatch]);

  // Keyboard shortcuts: ← pass, → like
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (users.length === 0) return;
      if (e.key === "ArrowLeft") setPendingDirection("left");
      if (e.key === "ArrowRight") setPendingDirection("right");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [users.length]);

  const handleSwiped = (userId: string, direction: "left" | "right") => {
    dispatch(removeUserFromFeed(userId));
    dispatch(
      swipeUser({ userId, status: direction === "right" ? "INTERESTED" : "IGNORED" })
    );
    setPendingDirection(null);
  };

  const topUser = users[0];

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col">
      <NavBar />

      {/* Swipe error toast */}
      {swipeError && (
        <div className="mx-auto mt-3 max-w-sm w-full px-4">
          <div className="flex items-center justify-between gap-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{swipeError}</p>
            <button
              onClick={() => dispatch(clearSwipeError())}
              className="text-red-400 text-sm font-bold"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Card stack */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm aspect-[3/4]">
          {loading && users.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 text-sm">Finding developers near you...</p>
            </div>
          )}

          {!loading && users.length === 0 && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6 rounded-3xl border border-dashed border-[#2A2A35]">
              <p className="text-white font-semibold">You're all caught up</p>
              <p className="text-slate-400 text-sm">
                No new developers right now — check back later.
              </p>
            </div>
          )}

          {error && users.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => dispatch(fetchFeed(1))}
                className="px-4 py-2 text-sm bg-[#8B5CF6] rounded-lg text-white font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {users.slice(0, VISIBLE_STACK_SIZE).map((u, i) => (
            <SwipeCard
              key={u._id}
              user={u}
              isTop={i === 0}
              stackPosition={i}
              triggerDirection={i === 0 ? pendingDirection : null}
              onSwiped={(direction) => handleSwiped(u._id, direction)}
            />
          ))}
        </div>

        {/* Action buttons */}
        {topUser && (
          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={() => setPendingDirection("left")}
              aria-label="Pass"
              className="w-14 h-14 rounded-full bg-[#141418] border border-[#2A2A35] flex items-center justify-center text-red-500 text-2xl font-bold hover:scale-110 active:scale-95 transition-transform"
            >
              ✕
            </button>
            <button
              onClick={() => setPendingDirection("right")}
              aria-label="Like"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-violet-500/30"
            >
              ♥
            </button>
          </div>
        )}

        <p className="text-xs text-slate-600 mt-6 hidden sm:block">
          Drag the card, or use ← / → keys
        </p>
      </main>
    </div>
  );
};

export default Home;
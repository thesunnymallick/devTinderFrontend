import React, { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon, FavouriteIcon, StarIcon, ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFeed, swipeUser, removeUserFromFeed, restoreUserToFeed, clearSwipeError } from "../../store/feedSlice";
import { fetchAcceptedConnections } from "../../store/connectionSlice";
import SwipeCard from "../../components/SwipeCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { FeedUser } from "../../api/feedApi";

const VISIBLE_STACK_SIZE = 3;

interface Category {
  label: string;
  keywords: string[];
}

const CATEGORIES: Category[] = [
  { label: "All", keywords: [] },
  { label: "Frontend", keywords: ["react", "vue", "angular", "html", "css", "javascript", "typescript", "frontend", "tailwind", "next"] },
  { label: "Backend", keywords: ["node", "express", "django", "flask", "spring", "backend", "java", "golang", "go", "ruby", "rails", ".net"] },
  { label: "Full Stack", keywords: ["full stack", "fullstack", "mern", "mean"] },
  { label: "Mobile", keywords: ["react native", "flutter", "swift", "kotlin", "android", "ios", "mobile"] },
  { label: "AI/ML", keywords: ["ai", "ml", "machine learning", "tensorflow", "pytorch", "nlp", "data science"] },
  { label: "DevOps", keywords: ["devops", "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "terraform"] },
];

const PROFILE_STRENGTH_FIELDS = [
  { key: "photoUrl", label: "Profile photo" },
  { key: "bio", label: "About you" },
  { key: "skills", label: "Skills" },
  { key: "age", label: "Age" },
] as const;

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { users, loading, error, swipeError, pagination } = useAppSelector((state) => state.feed);
  const { accepted } = useAppSelector((state) => state.connections);

  const [pendingDirection, setPendingDirection] = useState<"left" | "right" | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSwiped, setLastSwiped] = useState<FeedUser | null>(null);

  useEffect(() => {
    dispatch(fetchFeed(1));
    dispatch(fetchAcceptedConnections());
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

  const filteredUsers = useMemo(() => {
    let list = users;
    const category = CATEGORIES.find((c) => c.label === activeCategory);
    if (category && category.keywords.length > 0) {
      list = list.filter((u) =>
        (u.skills ?? []).some((skill) =>
          category.keywords.some((k) => skill.toLowerCase().includes(k))
        )
      );
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
          (u.skills ?? []).some((skill) => skill.toLowerCase().includes(term))
      );
    }
    return list;
  }, [users, activeCategory, searchTerm]);

  const trendingSkills = useMemo(() => {
    const counts = new Map<string, number>();
    users.forEach((u) => (u.skills ?? []).forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [users]);

  const profileStrength = useMemo(() => {
    if (!user) return { percent: 0, checks: PROFILE_STRENGTH_FIELDS.map((f) => ({ ...f, done: false })) };
    const checks = PROFILE_STRENGTH_FIELDS.map((f) => {
      const value = user[f.key as keyof typeof user];
      const done = Array.isArray(value) ? value.length > 0 : Boolean(value);
      return { ...f, done };
    });
    const percent = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
    return { percent, checks };
  }, [user]);

  const handleSwiped = (userId: string, direction: "left" | "right") => {
    const swipedUser = users.find((u) => u._id === userId) ?? null;
    setLastSwiped(swipedUser);
    dispatch(removeUserFromFeed(userId));
    dispatch(swipeUser({ userId, status: direction === "right" ? "INTERESTED" : "IGNORED" }));
    setPendingDirection(null);
  };

  const handleUndo = () => {
    if (!lastSwiped) return;
    dispatch(restoreUserToFeed(lastSwiped));
    setLastSwiped(null);
  };

  const topUser = filteredUsers[0];

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Ambient glow, matches the auth pages */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[160px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Search + filters */}
          <div className="space-y-4 mb-6">
            <div className="relative max-w-md">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#141418] border border-[#2A2A35] text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                    activeCategory === cat.label
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                      : "bg-[#141418] border-[#2A2A35] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            {/* Card column */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-[3/4]">
                {loading && filteredUsers.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">Finding developers near you...</p>
                  </div>
                )}

                {!loading && filteredUsers.length === 0 && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6 rounded-3xl border border-dashed border-[#2A2A35]">
                    <p className="text-white font-semibold">
                      {activeCategory === "All" ? "You're all caught up" : "No matches in this filter"}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {activeCategory === "All"
                        ? "No new developers right now — check back later."
                        : "Try a different category, or switch back to All."}
                    </p>
                  </div>
                )}

                {error && filteredUsers.length === 0 && (
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

                {filteredUsers.slice(0, VISIBLE_STACK_SIZE).map((u, i) => (
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

              {swipeError && (
                <div className="w-full max-w-sm mt-4 flex items-center justify-between gap-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{swipeError}</p>
                  <button
                    onClick={() => dispatch(clearSwipeError())}
                    className="text-red-400 text-sm font-bold"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Action buttons */}
              {topUser && (
                <div className="flex items-center gap-5 mt-8">
                  <button
                    onClick={handleUndo}
                    disabled={!lastSwiped}
                    title={lastSwiped ? "Bring the last card back" : "Nothing to undo"}
                    aria-label="Undo"
                    className="w-11 h-11 rounded-full bg-[#141418] border border-[#2A2A35] flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all"
                  >
                    <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={18} />
                  </button>
                  <button
                    onClick={() => setPendingDirection("left")}
                    aria-label="Pass"
                    className="w-14 h-14 rounded-full bg-[#141418] border border-[#2A2A35] flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={24} />
                  </button>
                  <button
                    onClick={() => setPendingDirection("right")}
                    aria-label="Like"
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-violet-500/30"
                  >
                    <HugeiconsIcon icon={FavouriteIcon} size={26} />
                  </button>
                  <button
                    onClick={() => setPendingDirection("right")}
                    aria-label="Super like"
                    title="Also sends a like — no separate backend tier exists yet"
                    className="w-11 h-11 rounded-full bg-[#141418] border border-[#2A2A35] flex items-center justify-center text-sky-400 hover:scale-110 active:scale-95 transition-all"
                  >
                    <HugeiconsIcon icon={StarIcon} size={18} />
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-600 mt-6 hidden sm:block">
                Drag the card, or use ← / → keys
              </p>
            </div>

            {/* Right rail */}
            <div className="space-y-5 hidden xl:block">
              {/* Your matches */}
              <div className="bg-[#141418] border border-[#2A2A35] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Your matches</h3>
                  {accepted.length > 0 && (
                    <a href="/connections" className="text-xs text-violet-400 hover:text-violet-300">
                      View all
                    </a>
                  )}
                </div>
                {accepted.length === 0 ? (
                  <p className="text-xs text-slate-500">No matches yet — start swiping!</p>
                ) : (
                  <div className="flex items-center -space-x-2">
                    {accepted.slice(0, 6).map((c) => (
                      <div
                        key={c.connectionId}
                        title={`${c.user.firstName} ${c.user.lastName}`}
                        className="w-9 h-9 rounded-full bg-[#18181B] border-2 border-[#141418] overflow-hidden flex items-center justify-center text-[11px] font-semibold text-slate-300"
                      >
                        {c.user.photoUrl ? (
                          <img src={c.user.photoUrl} alt={c.user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            {c.user.firstName?.[0]}
                            {c.user.lastName?.[0]}
                          </>
                        )}
                      </div>
                    ))}
                    {accepted.length > 6 && (
                      <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 border-2 border-[#141418] flex items-center justify-center text-[11px] font-semibold text-violet-300">
                        +{accepted.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile strength */}
              <div className="bg-[#141418] border border-[#2A2A35] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Your profile strength</h3>
                  <span className="text-sm font-bold text-violet-400">{profileStrength.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#2A2A35] overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#A78BFA] rounded-full transition-all"
                    style={{ width: `${profileStrength.percent}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {profileStrength.checks.map((c) => (
                    <div key={c.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{c.label}</span>
                      <span className={c.done ? "text-emerald-400" : "text-slate-600"}>
                        {c.done ? "✓" : "○"}
                      </span>
                    </div>
                  ))}
                </div>
                {profileStrength.percent < 100 && (
                  <a
                    href="/profile"
                    className="block mt-3 text-center text-xs font-medium text-violet-400 hover:text-violet-300"
                  >
                    Complete your profile
                  </a>
                )}
              </div>

              {/* Trending skills (from current feed batch) */}
              <div className="bg-[#141418] border border-[#2A2A35] rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Trending in your feed</h3>
                {trendingSkills.length === 0 ? (
                  <p className="text-xs text-slate-500">Not enough data yet.</p>
                ) : (
                  <div className="space-y-2">
                    {trendingSkills.map(([skill, count]) => (
                      <button
                        key={skill}
                        onClick={() => setSearchTerm(skill)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#18181B] transition-colors text-left"
                      >
                        <span className="text-sm text-slate-300">{skill}</span>
                        <span className="text-xs text-slate-500">{count} dev{count > 1 ? "s" : ""}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
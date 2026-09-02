import React, { useEffect, useRef, useState } from "react";
import type { FeedUser } from "../api/feedApi";

interface SwipeCardProps {
  user: FeedUser;
  isTop: boolean;
  /** 0 = top card, 1 = next, 2 = next-next... used for the resting stack offset. */
  stackPosition: number;
  /** Set by the Like/Pass buttons to trigger a swipe without dragging. */
  triggerDirection: "left" | "right" | null;
  onSwiped: (direction: "left" | "right") => void;
}

const SWIPE_THRESHOLD = 120;
const FLY_OUT_DISTANCE = 700;

const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  isTop,
  stackPosition,
  triggerDirection,
  onSwiped,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFlyingOut, setIsFlyingOut] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const flyOut = (direction: "left" | "right") => {
    setIsFlyingOut(true);
    setOffset((prev) => ({
      x: direction === "right" ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE,
      y: prev.y,
    }));
  };

  // Button-triggered swipe (no drag involved)
  useEffect(() => {
    if (triggerDirection && isTop && !isFlyingOut) {
      flyOut(triggerDirection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDirection]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTop || isFlyingOut) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart.current) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStart.current = null;

    if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
      flyOut(offset.x > 0 ? "right" : "left");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleTransitionEnd = () => {
    if (isFlyingOut) {
      onSwiped(offset.x > 0 ? "right" : "left");
    }
  };

  const rotation = offset.x / 20;
  const likeOpacity = Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 1);

  const stackScale = 1 - stackPosition * 0.04;
  const stackTranslateY = stackPosition * 12;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onTransitionEnd={handleTransitionEnd}
      className={`absolute inset-0 select-none touch-none ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{
        transform: isTop
          ? `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
          : `translateY(${stackTranslateY}px) scale(${stackScale})`,
        transition: isDragging ? "none" : "transform 0.35s ease, opacity 0.35s ease",
        opacity: isFlyingOut ? 0.3 : 1,
         zIndex: 20 - stackPosition,
      }}
    >
      <div
        className={`w-full h-full rounded-[28px] overflow-hidden bg-[#141418] border relative flex flex-col ${
          isTop
            ? "border-[#8B5CF6]/30 shadow-[0_0_60px_-15px_rgba(139,92,246,0.35)]"
            : "border-[#2A2A35] shadow-2xl"
        }`}
      >
        {/* Photo */}
        <div className="relative flex-[2] bg-gradient-to-br from-[#1c1c22] to-[#101013] min-h-0">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.firstName}
              draggable={false}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="w-24 h-24 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-3xl font-bold text-violet-300">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
          )}

          {isTop && (
            <>
              <div
                className="absolute top-6 left-6 px-4 py-1.5 border-4 border-green-400 rounded-lg -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                <span className="text-green-400 text-2xl font-extrabold tracking-wider">
                  LIKE
                </span>
              </div>
              <div
                className="absolute top-6 right-6 px-4 py-1.5 border-4 border-red-500 rounded-lg rotate-12"
                style={{ opacity: nopeOpacity }}
              >
                <span className="text-red-500 text-2xl font-extrabold tracking-wider">
                  NOPE
                </span>
              </div>
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141418] to-transparent" />
        </div>

        {/* Info */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-2.5 overflow-y-auto min-h-0">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {user.firstName} {user.lastName}
            {user.age ? (
              <span className="text-slate-400 font-normal">, {user.age}</span>
            ) : null}
          </h3>
          {user.bio && (
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{user.bio}</p>
          )}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {user.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#8B5CF6]/12 text-violet-300 border border-[#8B5CF6]/25"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
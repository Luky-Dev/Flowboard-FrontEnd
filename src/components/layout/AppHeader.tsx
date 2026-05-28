"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  backTo?: string;
  rightSlot?: React.ReactNode;
};

export default function AppHeader({ title = "Workspace", backTo = "/workspaces", rightSlot }: Props) {
  const router = useRouter();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">

      {/* LEFT */}
      <button
        onClick={() => router.push(backTo)}
        className="px-3 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
      >
        ← Back
      </button>

      {/* CENTER */}
      <h1 className="font-semibold text-gray-800 text-lg">
        {title}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-3 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
          >
            ↑ Top
          </button>
        )}

        {rightSlot}
      </div>

    </div>
  );
}
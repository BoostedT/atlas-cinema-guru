"use client";

import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function WatchLaterPage() {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load watch-later movies
  useEffect(() => {
    async function fetchWatchLater() {
      try {
        const res = await fetch(`/api/watch-later?page=${page}`);
        const data = await res.json();
        setWatchLater(data.watchLater || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error loading watch-later list", err);
      }
    }

    fetchWatchLater();
  }, [page]);

  // Toggle Favorite
  const toggleFavorite = async (id: string, isFavorited: boolean) => {
    await fetch(`/api/favorites/${id}`, {
      method: isFavorited ? "DELETE" : "POST",
    });

    // Update UI so card reflects new state
    setWatchLater((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, favorited: !m.favorited } : m
      )
    );
  };

  // Toggle Watch Later
  const toggleWatchLater = async (id: string, isWatchLater: boolean) => {
    await fetch(`/api/watch-later/${id}`, {
      method: isWatchLater ? "DELETE" : "POST",
    });

    // If the item is REMOVED, remove it from the page instantly
    if (isWatchLater) {
      setWatchLater((prev) => prev.filter((m) => m.id !== id));
    } else {
      // Should rarely happen but we still update the flag
      setWatchLater((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, watchLater: !m.watchLater } : m
        )
      );
    }
  };

  return (
    <div className="flex-1 bg-[#000A2A] min-h-screen px-12 py-10 text-white">

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-10">
        Watch Later
      </h1>

      {/* Movie Grid */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-10
        justify-items-center
      "
      >
        {watchLater.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleFavorite={toggleFavorite}
            onToggleWatchLater={toggleWatchLater}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 mb-12">
        <div className="flex rounded-full overflow-hidden border border-[#1ED2AF]">

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-6 py-2 bg-[#1ED2AF] text-[#00003C] 
                       font-medium hover:bg-[#18b89a] transition 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-6 py-2 bg-[#1ED2AF] text-[#00003C] 
                       font-medium hover:bg-[#18b89a] transition 
                       border-l border-[#00003C]/10 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
}

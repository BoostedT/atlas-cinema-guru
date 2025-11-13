"use client";

import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load Favorites
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`/api/favorites?page=${page}`);
        const data = await res.json();
        setFavorites(data.movies || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error loading favorites", err);
      }
    }
    fetchFavorites();
  }, [page]);

  // Toggle Favorite
  const toggleFavorite = async (id: string, isFavorited: boolean) => {
    await fetch(`/api/favorites/${id}`, {
      method: isFavorited ? "DELETE" : "POST",
    });

    // Remove from favorites page instantly when unfavorited:
    if (isFavorited) {
      setFavorites((prev) => prev.filter((m) => m.id !== id));
    } else {
      // Should not normally happen on this page,
      // but we still update UI if needed:
      setFavorites((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, favorited: !m.favorited } : m
        )
      );
    }
  };

  // Toggle Watch Later
  const toggleWatchLater = async (id: string, isWatchLater: boolean) => {
    await fetch(`/api/watch-later/${id}`, {
      method: isWatchLater ? "DELETE" : "POST",
    });

    // Update state so icon reflects immediately
    setFavorites((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, watchLater: !m.watchLater } : m
      )
    );
  };

  return (
    <div className="flex-1 bg-[#000A2A] min-h-screen px-12 py-10 text-white">

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-10">
        Favorites
      </h1>

      {/* Movie Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-10 
        justify-items-center
      ">
        {favorites.map((movie) => (
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
            className="px-6 py-2 bg-[#1ED2AF] text-[#00003C] font-medium hover:bg-[#18b89a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-[#1ED2AF] text-[#00003C] font-medium hover:bg-[#18b89a] transition border-l border-[#00003C]/10"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

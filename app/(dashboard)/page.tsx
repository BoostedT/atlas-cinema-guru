"use client";

import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaClock, FaRegClock } from "react-icons/fa";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState(1990);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());
  const [genres, setGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setAllGenres(data.genres || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        query: search,
        minYear: String(minYear),
        maxYear: String(maxYear),
        genres: genres.join(","),
      });
      const res = await fetch(`/api/titles?${query}`);
      const data = await res.json();
      setTitles(Array.isArray(data) ? data : data.titles || []);
      setLoading(false);
    };
    fetchTitles();
  }, [search, minYear, maxYear, genres, page]);

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
    setPage(1);
  };

  const toggleFavorite = async (titleId: string, isFavorited: boolean) => {
    await fetch(`/api/favorites/${titleId}`, {
      method: isFavorited ? "DELETE" : "POST",
    });
    setTitles((prev) =>
      prev.map((t) =>
        t.id === titleId ? { ...t, favorited: !t.favorited } : t
      )
    );
  };

  const toggleWatchLater = async (titleId: string, isWatchLater: boolean) => {
    await fetch(`/api/watch-later/${titleId}`, {
      method: isWatchLater ? "DELETE" : "POST",
    });
    setTitles((prev) =>
      prev.map((t) =>
        t.id === titleId ? { ...t, watchLater: !t.watchLater } : t
      )
    );
  };

  return (
    <div className="flex flex-col gap-10 bg-[#00003C] p-10 min-h-screen">
      {/* FILTERS */}
      <div className="flex flex-col w-full gap-6 ,ax-w-[600px]">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <label className="block mb-2 text-sm text-gray-300">Search</label>
          <input
            type="text"
            placeholder="Search Movies..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 rounded-full bg-[#000847] border border-[#40D6C0] focus:outline-none text-white"
          />
        </div>

        {/* Min/Max Year */}
        <div className="flex gap-6 w-fill max-w-[600px]">
          <div className="flex-1">
            <label className="block mb-2 text-sm text-gray-300">Min Year</label>
            <input
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(Number(e.target.value))}
              className="w-full p-2 rounded-full bg-[#000847] border border-[#40D6C0] focus:outline-none text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm text-gray-300">Max Year</label>
            <input
              type="number"
              value={maxYear}
              onChange={(e) => setMaxYear(Number(e.target.value))}
              className="w-full p-2 rounded-full bg-[#000847] border border-[#40D6C0] focus:outline-none text-white"
            />
          </div>
        </div>

        {/* Genres */}
        <div className="flex-1">
          <label className="block mb-2 text-sm text-gray-300">Genres</label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1 rounded-full border transition-all ${genres.includes(genre)
                  ? "bg-[#40D6C0] text-[#00003C] border-[#40D6C0]"
                  : "text-white border-[#40D6C0] hover:bg-[#40D6C0]/20"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MOVIE GRID */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="w-9/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 justify-start ">
          {titles.map((movie) => (
            <div
              key={movie.id}
              className="relative group rounded-2xl overflow-hidden border border-[#1ED2AF]/30 bg-[#0A0D3A]/60 hover:shadow-[0_0_10px_#1ED2AF80] transition"
            >
              {/* Poster */}
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover bio panel */}
              <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-[#00003c] border-t border-[#1ED2AF]/40 p-4 space-y-2">
                <h2 className="text-lg font-semibold">
                  {movie.title} ({movie.released})
                </h2>
                <p className="text-sm text-gray-300 leading-snug">
                  {movie.synopsis}
                </p>
                <span className="inline-block bg-[#1ED2AF] text-[#0A0D3A] text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  {movie.genre}
                </span>
              </div>

              {/* Favorite + Watch Later icons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => toggleFavorite(movie.id, movie.favorited)}>
                  {movie.favorited ? (
                    <FaStar className="text-yellow-400 text-xl" />
                  ) : (
                    <FaRegStar className="text-yellow-400 text-xl" />
                  )}
                </button>
                <button onClick={() => toggleWatchLater(movie.id, movie.watchLater)}>
                  {movie.watchLater ? (
                    <FaClock className="text-green-400 text-xl" />
                  ) : (
                    <FaRegClock className="text-green-400 text-xl" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
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

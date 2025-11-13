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
  
      {/* FILTERS ROW */}
      <div className="w-full flex justify-between items-start gap-10">
  
        {/* LEFT SIDE — Search + Min/Max */}
        <div className="flex flex-col gap-6 max-w-[500px] w-full">
  
          {/* Search */}
          <div>
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
          <div className="flex gap-4">
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
  
        </div>
  
        {/* RIGHT SIDE — GENRES */}
        <div className="flex flex-col max-w-[300px] w-full items-end">
          <label className="block mb-2 text-sm text-gray-300 text-right">Genres</label>
          <div className="flex flex-wrap gap-2 justify-end">
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  genres.includes(genre)
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
    </div>
  );
}

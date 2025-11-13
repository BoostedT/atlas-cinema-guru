"use client";

import { FaStar, FaRegStar, FaClock, FaRegClock } from "react-icons/fa";

interface MovieCardProps {
  movie: {
    id: number | string;
    title: string;
    released?: number;
    synopsis?: string;
    genre?: string;
    image: string;
    favorited?: boolean;
    watchLater?: boolean;
  };
  onToggleFavorite?: (id: string | number, isFav: boolean) => void;
  onToggleWatchLater?: (id: string | number, isWL: boolean) => void;
}

export default function MovieCard({
  movie,
  onToggleFavorite,
  onToggleWatchLater,
}: MovieCardProps) {
  return (
    <div
      className="relative w-full h-auto rounded-l-lg overflow-hidden border-2 
                 border-[#3BD2C4] shadow-lg group cursor-pointer transition-all duration-300"
    >
      {/* Poster */}
      <img
        src={
          movie.image.startsWith("/images/")
            ? movie.image
            : `/images/${movie.image.replace(/^.*[\\/]/, "")}`
        }
        alt={movie.title}
      />
      {/* Buttons */}
      <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(movie.id, movie.favorited ?? false);
          }}
        >
          {movie.favorited ? (
            <FaStar className="text-yellow-400 text-xl" />
          ) : (
            <FaRegStar className="text-white text-xl opacity-40" />
          )}
        </button>

        {/* Watch Later */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchLater?.(movie.id, movie.watchLater ?? false);
          }}
        >
          {movie.watchLater ? (
            <FaClock className="text-green-400 text-xl" />
          ) : (
            <FaRegClock className="text-white text-xl opacity-40" />
          )}
        </button>
      </div>

      {/* Hover Description Panel */}
      <div
        className="absolute bottom-0 left-0 w-full bg-[#000A2A]/80 p-5 translate-y-full 
                   group-hover:translate-y-0 transition-transform duration-300"
      >
        <h2 className="text-xl font-semibold text-white leading-tight">
          {movie.title}
          {movie.released ? ` (${movie.released})` : ""}
        </h2>

        {movie.synopsis && (
          <p className="text-sm text-white mt-2 leading-snug">{movie.synopsis}</p>
        )}

        {movie.genre && (
          <span className="inline-block mt-3 bg-[#7DE2C9] text-[#000A2A] px-3 py-1 rounded-full text-sm font-medium">
            {movie.genre}
          </span>
        )}
      </div>
    </div>
  );
}

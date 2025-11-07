import { auth, signOut } from "@/auth";
import Link from "next/link";
import { FaFolder, FaStar, FaClock } from "react-icons/fa";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen flex flex-col bg-[#0A0D3A] text-white font-[Montserrat]">
      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center bg-[#1ED2AF] px-6 py-3 shadow-md">
        <h1 className="text-lg font-bold text-[#0A0D3A] flex items-center gap-2">
          🎞️ Cinema Guru
        </h1>

        <div className="flex items-center gap-4 text-[#0A0D3A] text-sm">
          <span>
            Welcome,&nbsp;
            <span className="font-semibold">
              {session?.user?.email || "Guest"}
            </span>
          </span>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1 text-[#0A0D3A] font-medium hover:underline"
            >
              🔓 Logout
            </button>
          </form>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        <aside className="group bg-[#1ED2AF] text-[#0A0D3A] w-16 hover:w-64 transition-all duration-300 flex flex-col items-center py-6 overflow-y-auto">
          {/* Nav Links */}
          <nav className="flex flex-col gap-4 w-full">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 hover:bg-[#17b496] rounded-md transition"
            >
              <FaFolder className="text-2xl" />
              <span className="opacity-0 group-hover:opacity-100 transition-all font-medium">
                Home
              </span>
            </Link>

            <Link
              href="/favorites"
              className="flex items-center gap-3 px-4 py-2 hover:bg-[#17b496] rounded-md transition"
            >
              <FaStar className="text-2xl" />
              <span className="opacity-0 group-hover:opacity-100 transition-all font-medium">
                Favorites
              </span>
            </Link>

            <Link
              href="/watch-later"
              className="flex items-center gap-3 px-4 py-2 hover:bg-[#17b496] rounded-md transition"
            >
              <FaClock className="text-2xl" />
              <span className="opacity-0 group-hover:opacity-100 transition-all font-medium">
                Watch Later
              </span>
            </Link>
          </nav>

          {/* ===== ACTIVITY FEED ===== */}
          <div className="mt-10 bg-[#17b496] mx-3 p-4 rounded-lg w-[90%]">
            <h2 className="font-semibold text-[#0A0D3A] mb-3 text-center">
              Latest Activities
            </h2>
            <ul className="space-y-2 text-sm text-[#0A0D3A]">
              <li>
                <span className="block text-xs opacity-80">
                  10/2/2024, 5:11:17 PM
                </span>
                Added <strong>Before the Dawn</strong> to watch later
              </li>
              <li>
                <span className="block text-xs opacity-80">
                  10/1/2024, 4:00:07 PM
                </span>
                Favorited <strong>Beneath the Surface</strong>
              </li>
            </ul>
          </div>
        </aside>

        {/* ===== MAIN PAGE ===== */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

import { auth, signOut } from "@/auth";
import Link from "next/link";
import { FaFolder, FaStar, FaClock } from "react-icons/fa";
import { headers } from "next/headers";
import LatestActivity from "./components/LatestActivity";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const h = await headers();
  const pathname = h.get("x-pathname") || "/";
  const showActivityFeed = pathname === "/" || pathname === "/dashboard";

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

        {/* SIDEBAR WRAPPER */}
        <div className="group flex-none w-16 hover:w-64 transition-all duration-300 bg-[#1ED2AF]">

          {/* SIDEBAR CONTENT */}
          <aside className="h-full flex flex-col items-center py-6 overflow-y-auto text-[#0A0D3A]">

            {/* Nav Links */}
            <nav className="flex flex-col gap-6 w-full items-center">

              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 w-full justify-center group-hover:justify-start hover:bg-[#17b496] rounded-md transition"
              >
                <FaFolder className="text-2xl text-white" />
                <span className="hidden group-hover:block pl-2 font-medium">Home</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-3 px-3 py-2 w-full justify-center group-hover:justify-start hover:bg-[#17b496] rounded-md transition"
              >
                <FaStar className="text-2xl text-white" />
                <span className="hidden group-hover:block pl-2 font-medium">Favorites</span>
              </Link>

              <Link
                href="/watch-later"
                className="flex items-center gap-3 px-3 py-2 w-full justify-center group-hover:justify-start hover:bg-[#17b496] rounded-md transition"
              >
                <FaClock className="text-2xl text-white" />
                <span className="hidden group-hover:block pl-2 font-medium">Watch Later</span>
              </Link>

            </nav>

            {/* ===== ACTIVITY FEED ===== */}
            {showActivityFeed && (
              <div className="mt-10 w-[85%] bg-[#17b496] p-4 rounded-lg hidden group-hover:block">
                <h2 className="font-semibold text-[#0A0D3A] mb-3 text-center">
                  Latest Activities
                </h2>
                <LatestActivity />
              </div>
            )}

          </aside>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

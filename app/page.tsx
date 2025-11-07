import { auth, signOut } from "@/auth";
import { FaFolder, FaStar, FaClock } from "react-icons/fa";

export default async function Page() {
  const session = await auth();

  // Redirect or show message if not logged in
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0A0D3A] text-white">
        <h1 className="text-2xl mb-4">You must sign in to view this page.</h1>
        <a
          href="/signin"
          className="bg-[#1ED2AF] hover:bg-[#17b496] px-4 py-2 rounded font-medium transition"
        >
          Go to Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0D3A] text-white">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#1ED2AF] px-6 py-3 shadow-md">
        <h1 className="text-lg font-bold text-[#0A0D3A] flex items-center gap-2">
          🎞️ Cinema Guru
        </h1>

        <div className="flex items-center gap-4 text-[#0A0D3A] text-sm">
          <span>
            Welcome,&nbsp;
            <span className="font-semibold">
              {session.user?.email || session.user?.name}
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

      {/* Layout Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-[#1ED2AF] w-16 flex flex-col items-center py-8 space-y-8 text-[#0A0D3A]">
          <FaFolder className="text-2xl hover:text-white cursor-pointer transition" />
          <FaStar className="text-2xl hover:text-white cursor-pointer transition" />
          <FaClock className="text-2xl hover:text-white cursor-pointer transition" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center text-gray-200">
          <h2 className="text-2xl font-semibold">Dashboard Content Here</h2>
        </main>
      </div>
    </div>
  );
}

import { fetchFavorites } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * GET /api/favorites
 */
export const GET = auth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") || 1);

  if (!req.auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = req.auth.user;

  const movies = await fetchFavorites(page, email);

  return NextResponse.json({ movies });
});

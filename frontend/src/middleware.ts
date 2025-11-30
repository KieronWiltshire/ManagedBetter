import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow public routes
	const publicRoutes = ["/auth", "/install", "/api"];
	if (publicRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.next();
	}

	// Check authentication by trying to get session
	try {
		const sessionResponse = await fetch(`${API_URL}/api/auth/session`, {
			credentials: "include",
			headers: {
				Cookie: request.headers.get("cookie") || "",
			},
		});

		if (!sessionResponse.ok) {
			// Not authenticated, redirect to auth page
			// The auth page will handle NotInstalled errors
			const authUrl = new URL("/auth", request.url);
			authUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(authUrl);
		}

		const session = await sessionResponse.json().catch(() => null);
		if (!session?.user) {
			// No user in session, redirect to auth page
			const authUrl = new URL("/auth", request.url);
			authUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(authUrl);
		}
	} catch (error) {
		// Error checking session, redirect to auth page
		// The auth page will handle NotInstalled errors
		const authUrl = new URL("/auth", request.url);
		authUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(authUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};


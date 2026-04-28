import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const host = request.headers.get("host") || "";
    const pathname = request.nextUrl.pathname;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

    if (pathname.startsWith("/api/test")) {
        if (!isLocal) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};

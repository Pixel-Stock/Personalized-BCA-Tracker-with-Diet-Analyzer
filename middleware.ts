// middleware.ts (Next.js edge middleware — must be named exactly this)
// No auth. No redirects. Completely open — all routes pass through.
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {

  const token = req.cookies.get('next-auth.session-token')?.value
  const currentPathname = req.nextUrl.pathname
    // console.log(token)
    // console.log("pathname",req.nextUrl.pathname)

    if (!token && currentPathname !== '/') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin',
}
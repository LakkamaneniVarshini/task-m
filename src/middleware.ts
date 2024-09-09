import { NextResponse,NextRequest } from "next/server"
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log('Middleware path:', pathname)
  
    const sessionCookie = request.cookies.get('next-auth.session-token') || ''
    console.log('Session Cookie:', sessionCookie)
  
    if (!sessionCookie && (pathname.startsWith('/user') || pathname.startsWith('/chat'))) {
      console.log('Redirecting to login due to missing session cookie')
      return NextResponse.redirect(new URL('/', request.url))
    }
  
    return NextResponse.next()
  }
  
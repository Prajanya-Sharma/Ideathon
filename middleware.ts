import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
    '/clubs/:path*', 
    '/events/:path*', 
    '/resources/:path*',
    '/user/:path*',
    '/issues/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log(token);

  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith(`/verify-sid`))
  ) {
    if (token.isTeacher) {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (
    !token &&
    (url.pathname.startsWith('/clubs') || url.pathname.startsWith('/events') || url.pathname.startsWith('/resources')|| url.pathname.startsWith('/events') || url.pathname.startsWith('/issues'))
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if(!token?.sid_verification && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL(`/verify-sid/${token?.username}`, request.url));
  }

  return NextResponse.next();
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  AUTH_COOKIE_NAME,
  getBackendApiUrl,
  parseBackendResponse,
} from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await fetch(`${getBackendApiUrl()}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const user = await parseBackendResponse(response);
    return NextResponse.json({ user });
  } catch {
    const nextResponse = NextResponse.json({ user: null });
    nextResponse.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return nextResponse;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getBackendApiUrl,
  parseBackendResponse,
} from '@/lib/auth';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${getBackendApiUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseBackendResponse(response);
    const nextResponse = NextResponse.json({
      user: data.user,
      message: 'Login successful.',
    });

    nextResponse.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.accessToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ONE_DAY_IN_SECONDS,
    });

    return nextResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';

    return NextResponse.json({ message }, { status: 401 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl, parseBackendResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = getBackendApiUrl();
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await parseBackendResponse(response);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Registration failed.';

    return NextResponse.json({ message }, { status: 400 });
  }
}

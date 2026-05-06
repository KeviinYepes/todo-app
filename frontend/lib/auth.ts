export const AUTH_COOKIE_NAME = 'todo_auth_token';

export const getBackendApiUrl = () =>
  process.env.BACKEND_API_URL ?? 'http://localhost:8000';

export async function parseBackendResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : 'The request could not be completed.';

    throw new Error(message);
  }

  return data;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`API Error: ${data?.error}`);
  }

  return res.json();
}

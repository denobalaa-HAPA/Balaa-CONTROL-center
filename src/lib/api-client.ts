export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error(`Error requesting ${url}:`, err);
    return null;
  }
}

export async function fetchVendors() {
  return fetchJson<any[]>(`${API_BASE}/api/vendors`);
}

export async function fetchVendor(id: string) {
  return fetchJson<any>(`${API_BASE}/api/vendors/${id}`);
}

export async function updateVendor(id: string, updates: any) {
  return fetchJson<any>(`${API_BASE}/api/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates)
  });
}

export async function toggleVendorActive(slug: string, active: boolean) {
  // Uses PATCH /v1/admin/shops/:vendor_slug
  return fetchJson<any>(`${API_BASE}/api/vendors/v1/admin/shops/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  });
}

export async function fetchAnalyticsReport() {
  // Fetch platform reports
  return fetchJson<any>(`${API_BASE}/api/analytics/report`);
}

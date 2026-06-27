import { API_BASE } from "../lib/api-client.js";

export default async function VendorsPage() {
  const vendors = await fetch(`${API_BASE}/vendors`).then((r) => r.json());

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-lime-400 mb-4">Vendors</h1>
      <div className="space-y-4">
        {vendors.map((v: any) => (
          <div key={v.id} className="p-4 border border-gray-800 rounded-lg">
            <h3 className="font-semibold">{v.business_name}</h3>
            <p className="text-sm text-gray-400">Type: {v.business_type} | Status: {v.subscription_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
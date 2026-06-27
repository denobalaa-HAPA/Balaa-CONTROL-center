import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-lime-400 mb-6">Balaa Control Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/vendors" className="p-6 border border-gray-800 rounded-lg hover:border-lime-400 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Vendor Management</h2>
          <p className="text-gray-400">View and manage all vendors on the platform</p>
        </Link>
        <Link href="/analytics" className="p-6 border border-gray-800 rounded-lg hover:border-lime-400 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-400">View platform-wide analytics and reports</p>
        </Link>
        <Link href="/subscriptions" className="p-6 border border-gray-800 rounded-lg hover:border-lime-400 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Subscriptions</h2>
          <p className="text-gray-400">Manage vendor subscription plans</p>
        </Link>
      </div>
    </div>
  );
}
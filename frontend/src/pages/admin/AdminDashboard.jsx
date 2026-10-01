import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminDashboardApi";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats(token);
        setStats(res.data);
      } catch (error) {
        alert("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total  Posts"
          value={stats.totalPosts}
          color="blue"
        />
        <StatCard
          title="Published Posts"
          value={stats.publishedPosts}
          color="green"
        />
        <StatCard
          title="Pending  Posts"
          value={stats.draftPosts}
          color="yellow"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          color="purple"
        />
        <StatCard
          title="Total Comments"
          value={stats.totalComments}
          color="indigo"
        />
        <StatCard
          title="Pending Approved Comments"
          value={stats.pendingComments}
          color="red"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
      <h4 className="text-sm font-medium text-gray-500 mb-2">
        {title}
      </h4>
      <h2
        className={`text-4xl font-bold ${colorMap[color]}`}
      >
        {value}
      </h2>
    </div>
  );
}

export default AdminDashboard;

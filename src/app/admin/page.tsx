"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  PlayCircle,
  Clock,
  TrendingUp,
  Mail,
  Gift,
  ArrowRight,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  newUsersThisWeek: number;
  totalVideoViews: number;
  avgWatchTime: number;
  completionRate: number;
  pendingDiscounts: number;
  emailsSent: number;
  recentUsers: Array<{
    id: string;
    email: string;
    createdAt: string;
    progress?: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    user: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = stats || {
    totalUsers: 0,
    activeToday: 0,
    newUsersThisWeek: 0,
    totalVideoViews: 0,
    avgWatchTime: 0,
    completionRate: 0,
    pendingDiscounts: 0,
    emailsSent: 0,
    recentUsers: [],
    recentActivity: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Course analytics overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Activity className="w-3 h-3" />
          Live
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={s.totalUsers} subtext={`+${s.newUsersThisWeek} this week`} />
        <StatCard label="Active Today" value={s.activeToday} />
        <StatCard label="Video Views" value={s.totalVideoViews} />
        <StatCard label="Completion Rate" value={`${s.completionRate}%`} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Watch Time" value={`${Math.round(s.avgWatchTime / 60)}m`} />
        <StatCard label="Emails Sent" value={s.emailsSent} subtext="This month" />
        <StatCard 
          label="Pending Discounts" 
          value={s.pendingDiscounts} 
          highlight={s.pendingDiscounts > 0}
        />
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Quick Actions</p>
          <div className="mt-3 space-y-2">
            <Link href="/admin/users" className="flex items-center text-sm text-gray-700 hover:text-gray-900">
              <Users className="w-4 h-4 mr-2" /> View Users
            </Link>
            <Link href="/admin/discounts" className="flex items-center text-sm text-gray-700 hover:text-gray-900">
              <Gift className="w-4 h-4 mr-2" /> Discounts
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {s.recentUsers.length > 0 ? (
              s.recentUsers.slice(0, 6).map((user) => (
                <Link
                  key={user.id}
                  href="/admin/users"
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(user.createdAt)}</p>
                    </div>
                  </div>
                  {user.progress !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gray-900 rounded-full" 
                          style={{ width: `${user.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-7">{user.progress}%</span>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {s.recentActivity && s.recentActivity.length > 0 ? (
              s.recentActivity.slice(0, 8).map((activity) => (
                <div key={activity.id} className="px-4 py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.user}</span>
                    {" "}{activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No activity yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Automation Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">Email Automation</h2>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">25% Progress</p>
            <p className="font-medium text-gray-900">Encouragement email</p>
          </div>
          <div>
            <p className="text-gray-500">50% Progress</p>
            <p className="font-medium text-gray-900">Halfway milestone</p>
          </div>
          <div>
            <p className="text-gray-500">100% Progress</p>
            <p className="font-medium text-gray-900">Completion congrats</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  subtext,
  highlight 
}: { 
  label: string; 
  value: string | number; 
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white border rounded-lg p-4 ${highlight ? "border-gray-900" : "border-gray-200"}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

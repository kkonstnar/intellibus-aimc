"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  Mail,
  Settings,
  Gift,
  Menu,
  X,
  ExternalLink,
  Loader2,
  ShieldAlert,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/videos", label: "Videos", icon: PlayCircle },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/discounts", label: "Discounts", icon: Gift },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();

        if (data.isAdmin) {
          setIsAdmin(true);
        } else if (res.status === 401) {
          // Not logged in - redirect to course page to login
          setError("not_authenticated");
        } else {
          // Logged in but not admin
          setError("not_authorized");
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (error === "not_authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h1>
          <p className="text-gray-500 mb-6">
            You need to sign in to access the admin dashboard.
          </p>
          <Link
            href="/course"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Not authorized (logged in but not admin)
  if (error === "not_authorized" || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Add your email to <code className="bg-gray-100 px-1 py-0.5 rounded">ADMIN_EMAILS</code> in your .env.local file.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Admin access granted
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-900">Admin</span>
        <Link href="/" className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
          <ExternalLink className="w-5 h-5 text-gray-600" />
        </Link>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-200 transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">AI Masterclass</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

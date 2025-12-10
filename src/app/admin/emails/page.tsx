"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EmailNotification {
  id: string;
  userId: string;
  email: string;
  type: string;
  subject: string;
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  sent: number;
  opened: number;
  pending: number;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, sent: 0, opened: 0, pending: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "sent" | "pending" | "opened">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmails();
  }, [page, filter, search]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
        status: filter === "all" ? "" : filter,
        ...(search && { search }),
      });
      const response = await fetch(`/api/admin/emails?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
        setStats(data.stats || { total: 0, sent: 0, opened: 0, pending: 0 });
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      reminder: "Reminder",
      progress: "Progress",
      completion: "Completion",
      milestone_25: "25% Milestone",
      milestone_50: "50% Milestone",
      milestone_75: "75% Milestone",
      milestone_100: "Completed",
      offer: "Offer",
      welcome: "Welcome",
    };
    return types[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
      case "opened":
        return <Eye className="w-4 h-4 text-gray-900" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-300" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Mail className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Emails</h1>
        <p className="text-sm text-gray-500">Email notifications sent to users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Sent</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.sent}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Opened</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.opened}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Open Rate</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {(["all", "sent", "opened", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm capitalize ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Mail className="w-8 h-8 mb-2" />
            <p className="text-sm">No emails found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Recipient
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Subject
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Sent
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Opened
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {getStatusIcon(email.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{email.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {getTypeLabel(email.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 truncate max-w-xs block">
                      {email.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(email.sentAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(email.openedAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


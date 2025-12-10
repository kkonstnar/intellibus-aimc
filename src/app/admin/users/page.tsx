"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Clock,
  PlayCircle,
  CheckCircle,
  Send,
  Loader2,
  Crown,
  Download,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  company: string | null;
  jobTitle: string | null;
  paidAt: string | null;
  amountPaid: number | null;
  emailVerified: boolean;
  createdAt: string;
  progress: {
    totalModules: number;
    completedModules: number;
    totalWatchTime: number;
    lastActiveAt: string | null;
  };
}

interface Stats {
  freeUsers: number;
  paidUsers: number;
  activeToday: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [stats, setStats] = useState<Stats>({ freeUsers: 0, paidUsers: 0, activeToday: 0 });
  
  // Selected user panel
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Email dialog
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailType, setEmailType] = useState<"reminder" | "progress" | "offer">("reminder");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search, tierFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "15",
        search,
        tier: tierFilter,
      });
      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedUser) return;
    setSendingEmail(true);
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          type: emailType,
          customSubject: emailType === "offer" ? customSubject : undefined,
          customMessage: emailType === "offer" ? customMessage : undefined,
        }),
      });
      if (response.ok) {
        setShowEmailDialog(false);
        setCustomSubject("");
        setCustomMessage("");
        alert("Email sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Name", "Tier", "Company", "Progress", "Watch Time", "Joined"];
    const rows = users.map((u) => [
      u.email,
      u.name || "",
      u.tier,
      u.company || "",
      `${u.progress.completedModules}/${u.progress.totalModules}`,
      `${Math.round(u.progress.totalWatchTime / 60)}m`,
      new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{total} total users</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Free</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.freeUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            Paid <Crown className="w-3 h-3" />
          </p>
          <p className="text-2xl font-semibold text-gray-900">{stats.paidUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active Today</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.activeToday}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {(["all", "free", "paid"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => {
                setTierFilter(tier);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm capitalize ${
                tierFilter === tier
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tier}
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
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            No users found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Tier</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Progress</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Watch Time</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        user.tier === "paid" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 truncate">{user.email}</p>
                        {user.name && (
                          <p className="text-xs text-gray-500 truncate">{user.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${
                      user.tier === "paid"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.tier === "paid" && <Crown className="w-3 h-3" />}
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{
                            width: `${(user.progress.completedModules / user.progress.totalModules) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {user.progress.completedModules}/{user.progress.totalModules}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {formatTime(user.progress.totalWatchTime)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(user.createdAt)}
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
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* User Detail Panel */}
      {selectedUser && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedUser(null)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-900">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${
                  selectedUser.tier === "paid" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {selectedUser.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  {selectedUser.name && (
                    <p className="text-sm text-gray-500">{selectedUser.name}</p>
                  )}
                  <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs rounded ${
                    selectedUser.tier === "paid"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedUser.tier === "paid" && <Crown className="w-3 h-3" />}
                    {selectedUser.tier}
                  </span>
                </div>
              </div>

              {/* Info */}
              {(selectedUser.company || selectedUser.jobTitle) && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedUser.company && (
                    <p className="text-sm">
                      <span className="text-gray-500">Company:</span>{" "}
                      <span className="text-gray-900">{selectedUser.company}</span>
                    </p>
                  )}
                  {selectedUser.jobTitle && (
                    <p className="text-sm">
                      <span className="text-gray-500">Title:</span>{" "}
                      <span className="text-gray-900">{selectedUser.jobTitle}</span>
                    </p>
                  )}
                </div>
              )}

              {selectedUser.tier === "paid" && selectedUser.amountPaid && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedUser.amountPaid}
                  </p>
                  {selectedUser.paidAt && (
                    <p className="text-xs text-gray-500">
                      Paid on {formatDate(selectedUser.paidAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Progress */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Progress</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Modules completed</span>
                      <span className="text-gray-900">
                        {selectedUser.progress.completedModules} / {selectedUser.progress.totalModules}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-gray-900 rounded-full"
                        style={{
                          width: `${(selectedUser.progress.completedModules / selectedUser.progress.totalModules) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(selectedUser.progress.totalWatchTime)}
                      </p>
                      <p className="text-xs text-gray-500">Watch time</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <CheckCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-lg font-semibold text-gray-900">
                        {Math.round((selectedUser.progress.completedModules / selectedUser.progress.totalModules) * 100)}%
                      </p>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3">Send Email</p>
                <button
                  onClick={() => {
                    setEmailType("reminder");
                    setShowEmailDialog(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reminder</p>
                    <p className="text-xs text-gray-500">Nudge to continue learning</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setEmailType("progress");
                    setShowEmailDialog(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <PlayCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Progress Report</p>
                    <p className="text-xs text-gray-500">Send their stats summary</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setEmailType("offer");
                    setShowEmailDialog(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Crown className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Special Offer</p>
                    <p className="text-xs text-gray-500">Send a custom offer or discount</p>
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-400">
                  Joined {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Email Dialog */}
      {showEmailDialog && selectedUser && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowEmailDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {emailType === "reminder" && "Send Reminder Email"}
              {emailType === "progress" && "Send Progress Report"}
              {emailType === "offer" && "Send Special Offer"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              To: {selectedUser.email}
            </p>

            {emailType === "offer" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Special offer just for you..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write your offer details..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  {emailType === "reminder" &&
                    "This will send a friendly reminder encouraging them to continue learning."}
                  {emailType === "progress" &&
                    "This will send their current progress stats including completed modules and watch time."}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEmailDialog(false)}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || (emailType === "offer" && !customSubject)}
                className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

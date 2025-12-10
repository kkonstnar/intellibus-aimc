"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Check,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface DiscountRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  status: string;
  createdAt: string;
}

export default function DiscountsPage() {
  const [requests, setRequests] = useState<DiscountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "sent">("pending");
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [filter, search]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filter === "all" ? "" : filter,
        ...(search && { search }),
      });
      const response = await fetch(`/api/admin/discount-requests?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch discount requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/discount-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const sendDiscountEmail = async (request: DiscountRequest) => {
    setSendingId(request.id);
    try {
      await fetch("/api/admin/send-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: request.email,
          name: request.name,
          company: request.company,
        }),
      });
      await updateStatus(request.id, "sent");
    } catch (error) {
      alert("Failed to send email");
    } finally {
      setSendingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Discount Requests</h1>
        <p className="text-sm text-gray-500">Manage discount code requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Sent</p>
          <p className="text-2xl font-semibold text-gray-900">
            {requests.filter((r) => r.status === "sent").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {(["pending", "sent", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
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
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Mail className="w-8 h-8 mb-2" />
            <p className="text-sm">No requests found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Contact
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Date
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.name}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{request.company}</p>
                      <p className="text-xs text-gray-500">{request.jobTitle}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded ${
                        request.status === "pending"
                          ? "bg-gray-100 text-gray-600"
                          : request.status === "sent"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {request.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => sendDiscountEmail(request)}
                          disabled={sendingId === request.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                          {sendingId === request.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          Send
                        </button>
                        <button
                          onClick={() => updateStatus(request.id, "expired")}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                        <Check className="w-3 h-3" /> Sent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  PlayCircle,
  Clock,
  Users,
  Eye,
  X,
  Loader2,
} from "lucide-react";

interface VideoStats {
  id: string;
  slug: string;
  title: string;
  duration: number;
  tier: string;
  totalViews: number;
  uniqueViewers: number;
  avgWatchTime: number;
  avgCompletionPct: number;
  completionCount: number;
  dropOffPoints: Array<{ position: number; count: number }>;
}

interface VideoAnalytics {
  modules: VideoStats[];
  totals: {
    totalViews: number;
    uniqueViewers: number;
    totalWatchTime: number;
    avgCompletionRate: number;
  };
}

export default function VideosPage() {
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoStats | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/video-analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch video analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  const data = analytics || {
    modules: [],
    totals: {
      totalViews: 0,
      uniqueViewers: 0,
      totalWatchTime: 0,
      avgCompletionRate: 0,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <p className="text-sm text-gray-500">Video performance analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Views</p>
          <p className="text-2xl font-semibold text-gray-900">{data.totals.totalViews}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Unique Viewers</p>
          <p className="text-2xl font-semibold text-gray-900">{data.totals.uniqueViewers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Watch Time</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatWatchTime(data.totals.totalWatchTime)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Completion</p>
          <p className="text-2xl font-semibold text-gray-900">{data.totals.avgCompletionRate}%</p>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {data.modules.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Video
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Duration
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Tier
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Views
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Avg Watch
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">
                  Completion
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.modules.map((video) => (
                <tr
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{formatDuration(video.duration)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded ${
                        video.tier === "paid"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {video.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{video.totalViews}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {formatDuration(Math.round(video.avgWatchTime))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${video.avgCompletionPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(video.avgCompletionPct)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <PlayCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">No video data yet</p>
            <p className="text-xs">Analytics appear when users start watching</p>
          </div>
        )}
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedVideo(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-900">{selectedVideo.title}</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{selectedVideo.totalViews}</p>
                  <p className="text-xs text-gray-500">Total Views</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{selectedVideo.uniqueViewers}</p>
                  <p className="text-xs text-gray-500">Unique Viewers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDuration(Math.round(selectedVideo.avgWatchTime))}
                  </p>
                  <p className="text-xs text-gray-500">Avg Watch Time</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <PlayCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{selectedVideo.completionCount}</p>
                  <p className="text-xs text-gray-500">Completions</p>
                </div>
              </div>

              {/* Completion Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Avg Completion</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(selectedVideo.avgCompletionPct)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: `${selectedVideo.avgCompletionPct}%` }}
                  />
                </div>
              </div>

              {/* Drop-off Points */}
              {selectedVideo.dropOffPoints && selectedVideo.dropOffPoints.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Drop-off Points</p>
                  <div className="space-y-2">
                    {selectedVideo.dropOffPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{formatDuration(point.position)}</span>
                        <span className="text-gray-500">{point.count} dropped</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

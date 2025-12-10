"use client";

// Course Content Component - Udemy-inspired video learning platform

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import {
  CheckCircle,
  Clock,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { trackDualEvent } from "../utils/dualAnalytics";
import { signOut } from "../lib/auth-client";
import { useVideoProgress } from "../hooks/useVideoProgress";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  playbackId?: string;
  tier: "free" | "paid";
}

interface Section {
  id: string;
  title: string;
  modules: CourseModule[];
}

const COURSE_SECTIONS: Section[] = [
  {
    id: "section-1",
    title: "Getting Started with AI",
    modules: [
  {
    id: "module-1",
        title: "Welcome & Course Overview",
        description: "Introduction to the AI Masterclass and what you'll learn",
        duration: 300,
        playbackId: "FQlNEHa3G90117sMdpV7cxXW8FGFZe34S8tEklf1xFDs",
        tier: "free",
  },
  {
    id: "module-2",
        title: "The AI Landscape in 2024",
        description: "Current state of AI and key trends for business leaders",
        duration: 720,
        playbackId: "",
        tier: "free",
  },
    ],
  },
  {
    id: "section-2",
    title: "AI Strategy for Executives",
    modules: [
  {
    id: "module-3",
        title: "Building Your AI Strategy",
        description: "Framework for developing an AI roadmap",
        duration: 900,
        playbackId: "",
        tier: "free",
  },
  {
    id: "module-4",
        title: "Identifying AI Opportunities",
        description: "How to spot high-value AI use cases in your organization",
        duration: 840,
        playbackId: "",
        tier: "free",
  },
    ],
  },
  {
    id: "section-3",
    title: "Implementation & Leadership",
    modules: [
  {
    id: "module-5",
        title: "Data Infrastructure Essentials",
        description: "What you need to succeed with AI initiatives",
        duration: 780,
        playbackId: "",
        tier: "paid",
      },
      {
        id: "module-6",
        title: "Leading AI Transformation",
        description: "Change management and building AI-ready teams",
        duration: 900,
        playbackId: "",
        tier: "paid",
  },
    ],
  },
];

const ALL_MODULES = COURSE_SECTIONS.flatMap((s) => s.modules);

interface CourseContentProps {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function CourseContent({ user }: CourseContentProps) {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<CourseModule>(ALL_MODULES[0]);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(COURSE_SECTIONS.map((s) => s.id))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const playerRef = useRef<any>(null);

  const videoProgress = useVideoProgress({
    userId: user.id,
    moduleId: selectedModule.id,
    moduleTitle: selectedModule.title,
    videoDuration: selectedModule.duration,
  });

  // Get current module index for navigation
  const currentIndex = ALL_MODULES.findIndex((m) => m.id === selectedModule.id);
  const prevModule = currentIndex > 0 ? ALL_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < ALL_MODULES.length - 1 ? ALL_MODULES[currentIndex + 1] : null;

  useEffect(() => {
    trackDualEvent("course_content_accessed", {
      user_id: user.id,
      email: user.email,
    });
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/course/progress?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const completed = new Set<string>(
          data.progress?.filter((p: any) => p.completed).map((p: any) => p.moduleId as string) || []
        );
        setCompletedModules(completed);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const canAccessModule = (module: CourseModule) => {
    if (module.tier === "free") return true;
    const freeModules = ALL_MODULES.filter((m) => m.tier === "free");
    return freeModules.every((m) => completedModules.has(m.id));
  };

  const handleModuleSelect = (module: CourseModule) => {
    if (!canAccessModule(module)) return;
    setSelectedModule(module);
    setSidebarOpen(false);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevious = () => {
    if (prevModule && canAccessModule(prevModule)) {
      handleModuleSelect(prevModule);
    }
  };

  const goToNext = () => {
    if (nextModule && canAccessModule(nextModule)) {
      handleModuleSelect(nextModule);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = completedModules.size;
  const totalCount = ALL_MODULES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[#1c1d1f] flex flex-col">
      {/* Top Navigation */}
      <header className="h-12 sm:h-14 bg-[#1c1d1f] border-b border-[#3e4143] flex items-center px-3 sm:px-4 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={() => router.push("/")}
            className="p-1.5 text-white hover:text-purple-400 transition-colors shrink-0"
          >
            <Home className="w-5 h-5" />
          </button>
          <div className="hidden sm:block h-6 w-px bg-[#3e4143]" />
          <img
            src="/AIMC_Angled_Horiz_w Title_Violet.png"
            alt="AI Masterclass"
            className="h-6 sm:h-7 shrink-0"
          />
          <span className="hidden lg:block text-sm text-[#a1a5aa] truncate">
            {selectedModule.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-20 sm:w-24 h-1.5 bg-[#3e4143] rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[#a1a5aa] text-xs sm:text-sm whitespace-nowrap">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Mobile: Show menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-[#a1a5aa] hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={handleSignOut}
            className="p-1.5 text-[#a1a5aa] hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player Container - Responsive height */}
          <div className="bg-black w-full relative">
            <div className="w-full" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0">
                {selectedModule.playbackId ? (
                  <MuxPlayer
                    ref={playerRef}
                    playbackId={selectedModule.playbackId}
                    metadataVideoTitle={selectedModule.title}
                    streamType="on-demand"
                    className="w-full h-full"
                    accentColor="#a855f7"
                    onPlay={() => videoProgress.onPlay(playerRef.current?.currentTime || 0)}
                    onPause={() => videoProgress.onPause(playerRef.current?.currentTime || 0)}
                    onEnded={() => {
                      videoProgress.onEnded();
                      setCompletedModules((prev) => new Set(prev).add(selectedModule.id));
                    }}
                    onTimeUpdate={() => {
                      videoProgress.onTimeUpdate(playerRef.current?.currentTime || 0);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#6a6f73]">
                    <PlayCircle className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 mb-3 sm:mb-4 opacity-50" />
                    <p className="text-base sm:text-lg">Video coming soon</p>
                    <p className="text-xs sm:text-sm mt-1 opacity-75">This lesson is being prepared</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Bar Below Video */}
          <div className="bg-[#2d2f31] border-b border-[#3e4143] px-3 sm:px-4 py-2 flex items-center justify-between">
            <button
              onClick={goToPrevious}
              disabled={!prevModule || !canAccessModule(prevModule)}
              className="flex items-center gap-1 sm:gap-2 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:text-purple-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#a1a5aa]">
              <span>{currentIndex + 1} / {totalCount}</span>
            </div>

            <button
              onClick={goToNext}
              disabled={!nextModule || !canAccessModule(nextModule)}
              className="flex items-center gap-1 sm:gap-2 text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:text-purple-400 transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Content Below Video */}
          <div className="flex-1 overflow-y-auto bg-white">
            {/* Tabs */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex px-4 sm:px-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 sm:py-4 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-3 sm:py-4 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "notes"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Notes
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "overview" ? (
                <div className="max-w-3xl">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {selectedModule.title}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    {selectedModule.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-4 sm:mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDuration(selectedModule.duration)}
                    </span>
                    {selectedModule.tier === "paid" && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                        Premium
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span>Lesson {currentIndex + 1} of {totalCount}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {completedModules.has(selectedModule.id) ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setCompletedModules((prev) => new Set(prev).add(selectedModule.id));
                          trackDualEvent("module_marked_complete", {
                            user_id: user.id,
                            module_id: selectedModule.id,
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as complete
                      </button>
                    )}

                    {nextModule && canAccessModule(nextModule) && (
                      <button
                        onClick={goToNext}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                      >
                        Next lesson
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Progress */}
                  <div className="mt-6 sm:hidden p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">Your progress</span>
                      <span className="text-lg font-bold text-purple-600">{progressPercent}%</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {ALL_MODULES.map((module) => (
                        <div
                          key={module.id}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            completedModules.has(module.id)
                              ? "bg-purple-600"
                              : module.id === selectedModule.id
                              ? "bg-purple-300"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{completedCount} completed</span>
                      <span>{totalCount - completedCount} remaining</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Your Notes</h2>
                  <textarea
                    placeholder="Take notes for this lesson..."
                    className="w-full h-40 sm:h-48 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Notes are saved locally in your browser
                  </p>
                </div>
                  )}
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 xl:w-96 bg-white border-l border-gray-200 overflow-y-auto shrink-0">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <h2 className="font-bold text-gray-900 mb-3">Course content</h2>
            {/* Segmented Progress */}
            <div className="flex gap-1 mb-2">
              {ALL_MODULES.map((module) => (
                <div
                  key={module.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    completedModules.has(module.id)
                      ? "bg-purple-600"
                      : module.id === selectedModule.id
                      ? "bg-purple-300"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{completedCount} of {totalCount} complete</span>
              <span className="font-medium text-purple-600">{progressPercent}%</span>
            </div>
          </div>
          <CourseList
            sections={COURSE_SECTIONS}
            selectedModule={selectedModule}
            completedModules={completedModules}
            expandedSections={expandedSections}
            onModuleSelect={handleModuleSelect}
            onToggleSection={toggleSection}
            canAccessModule={canAccessModule}
            formatDuration={formatDuration}
          />
        </aside>

        {/* Sidebar - Mobile (Slide-over) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/60 transition-opacity" 
              onClick={() => setSidebarOpen(false)} 
            />
            <aside className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Course content</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 -mr-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Progress Section */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1 mb-2">
                  {ALL_MODULES.map((module) => (
                    <div
                      key={module.id}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        completedModules.has(module.id)
                          ? "bg-purple-600"
                          : module.id === selectedModule.id
                          ? "bg-purple-300"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{completedCount} of {totalCount} lessons</span>
                  <span className="font-semibold text-purple-600">{progressPercent}%</span>
                </div>
              </div>

              {/* Course List */}
              <div className="flex-1 overflow-y-auto">
                <CourseList
                  sections={COURSE_SECTIONS}
                  selectedModule={selectedModule}
                  completedModules={completedModules}
                  expandedSections={expandedSections}
                  onModuleSelect={handleModuleSelect}
                  onToggleSection={toggleSection}
                  canAccessModule={canAccessModule}
                  formatDuration={formatDuration}
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

// Extracted CourseList component for reuse
function CourseList({
  sections,
  selectedModule,
  completedModules,
  expandedSections,
  onModuleSelect,
  onToggleSection,
  canAccessModule,
  formatDuration,
}: {
  sections: Section[];
  selectedModule: CourseModule;
  completedModules: Set<string>;
  expandedSections: Set<string>;
  onModuleSelect: (module: CourseModule) => void;
  onToggleSection: (id: string) => void;
  canAccessModule: (module: CourseModule) => boolean;
  formatDuration: (seconds: number) => string;
}) {
  return (
    <div>
      {sections.map((section, sectionIndex) => {
        const sectionModules = section.modules;
        const completedInSection = sectionModules.filter((m) => completedModules.has(m.id)).length;
        const isExpanded = expandedSections.has(section.id);

        return (
          <div key={section.id} className="border-b border-gray-200">
            <button
              onClick={() => onToggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  Section {sectionIndex + 1}: {section.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {completedInSection}/{sectionModules.length} |{" "}
                  {formatDuration(sectionModules.reduce((acc, m) => acc + m.duration, 0))}
                </p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div>
                {sectionModules.map((module, moduleIndex) => {
                  const isCompleted = completedModules.has(module.id);
                  const isSelected = selectedModule.id === module.id;
                  const isLocked = !canAccessModule(module);

                  return (
                    <button
                      key={module.id}
                      onClick={() => onModuleSelect(module)}
                      disabled={isLocked}
                      className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                        isSelected ? "bg-purple-50" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                        ) : (
                          <div className={`w-4 h-4 border-2 rounded ${isSelected ? "border-purple-600" : "border-gray-300"}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${isSelected ? "font-semibold text-purple-900" : "text-gray-700"}`}>
                          {moduleIndex + 1}. {module.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <PlayCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-500">{formatDuration(module.duration)}</span>
                          {module.tier === "paid" && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                              PRO
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="shrink-0 mt-1">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

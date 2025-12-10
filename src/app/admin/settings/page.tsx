"use client";

import { useState } from "react";
import {
  Save,
  Mail,
  Bell,
  Shield,
  DollarSign,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    fromName: "AI Masterclass",
    fromEmail: "",
    replyTo: "",
  });

  // Automation settings
  const [automationSettings, setAutomationSettings] = useState({
    sendWelcomeEmail: true,
    sendMilestoneEmails: true,
    sendCompletionEmail: true,
    sendReminderAfterDays: 7,
  });

  // Course settings
  const [courseSettings, setCourseSettings] = useState({
    originalPrice: 1000,
    discountedPrice: 600,
    specialDiscountPrice: 400,
    freeModulesCount: 2,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Configure your course platform</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Email Settings */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <h2 className="font-medium text-gray-900">Email Settings</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">From Name</label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">From Email</label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                  }
                  placeholder="noreply@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Set EMAIL_USER in .env</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Reply-To Email</label>
                <input
                  type="email"
                  value={emailSettings.replyTo}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, replyTo: e.target.value })
                  }
                  placeholder="support@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Course Pricing */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <h2 className="font-medium text-gray-900">Course Pricing</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Original</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={courseSettings.originalPrice}
                      onChange={(e) =>
                        setCourseSettings({
                          ...courseSettings,
                          originalPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Pre-order</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={courseSettings.discountedPrice}
                      onChange={(e) =>
                        setCourseSettings({
                          ...courseSettings,
                          discountedPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Special Discount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={courseSettings.specialDiscountPrice}
                      onChange={(e) =>
                        setCourseSettings({
                          ...courseSettings,
                          specialDiscountPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Free Modules</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={courseSettings.freeModulesCount}
                    onChange={(e) =>
                      setCourseSettings({
                        ...courseSettings,
                        freeModulesCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Automation Settings */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <h2 className="font-medium text-gray-900">Email Automation</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="Welcome Email"
                description="Send when user signs up"
                checked={automationSettings.sendWelcomeEmail}
                onChange={(checked) =>
                  setAutomationSettings({ ...automationSettings, sendWelcomeEmail: checked })
                }
              />
              <Toggle
                label="Milestone Emails"
                description="Send at 25%, 50%, 75% progress"
                checked={automationSettings.sendMilestoneEmails}
                onChange={(checked) =>
                  setAutomationSettings({ ...automationSettings, sendMilestoneEmails: checked })
                }
              />
              <Toggle
                label="Completion Email"
                description="Send when course is completed"
                checked={automationSettings.sendCompletionEmail}
                onChange={(checked) =>
                  setAutomationSettings({ ...automationSettings, sendCompletionEmail: checked })
                }
              />
              <div className="p-4">
                <label className="block text-sm text-gray-600 mb-1.5">
                  Send reminder after (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={automationSettings.sendReminderAfterDays}
                  onChange={(e) =>
                    setAutomationSettings({
                      ...automationSettings,
                      sendReminderAfterDays: parseInt(e.target.value) || 7,
                    })
                  }
                  className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Environment Status */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <h2 className="font-medium text-gray-900">Environment</h2>
            </div>
            <div className="p-4 space-y-2">
              <EnvRow name="DATABASE_URL" status="set" />
              <EnvRow name="BETTER_AUTH_SECRET" status="set" />
              <EnvRow name="EMAIL_USER" status="not-set" />
              <EnvRow name="EMAIL_PASSWORD" status="not-set" />
              <EnvRow name="POSTHOG_API_KEY" status="not-set" />
              <EnvRow name="POLAR_ACCESS_TOKEN" status="not-set" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-gray-900" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function EnvRow({ name, status }: { name: string; status: "set" | "not-set" }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <code className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">{name}</code>
      {status === "set" ? (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Check className="w-3 h-3" /> Set
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <AlertCircle className="w-3 h-3" /> Not set
        </span>
      )}
    </div>
  );
}

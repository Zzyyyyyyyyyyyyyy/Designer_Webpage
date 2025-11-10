import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Mail,
  User,
  Save,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function SettingsPage() {
  const { user, updateSettings, logout } = useAuth();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Settings state
  const [profileVisibility, setProfileVisibility] = useState(
    user?.settings.profileVisibility || "public"
  );
  const [showEmail, setShowEmail] = useState(user?.settings.showEmail || false);
  const [showStats, setShowStats] = useState(user?.settings.showStats || true);
  const [indexable, setIndexable] = useState(user?.settings.indexable || true);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(
    user?.settings.emailNotifications || {
      newFollower: true,
      likes: true,
      comments: true,
      messages: true,
      systemUpdates: true,
      marketing: false,
    }
  );
  const [pushNotifications, setPushNotifications] = useState(
    user?.settings.pushNotifications || {
      enabled: false,
      newFollower: true,
      likes: true,
      comments: true,
      messages: true,
    }
  );
  const [notificationFrequency, setNotificationFrequency] = useState(
    user?.settings.notificationFrequency || "realtime"
  );

  // Preferences
  const [language, setLanguage] = useState(user?.settings.language || "en");
  const [timezone, setTimezone] = useState(user?.settings.timezone || "UTC");
  const [currency, setCurrency] = useState(user?.settings.currency || "USD");
  const [theme, setTheme] = useState(user?.settings.theme || "dark");
  const [viewMode, setViewMode] = useState(user?.settings.viewMode || "grid");

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.settings.twoFactorEnabled || false
  );

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Simulate API call
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully!");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    updateSettings({
      profileVisibility,
      showEmail,
      showStats,
      indexable,
      emailNotifications,
      pushNotifications,
      notificationFrequency,
      language,
      timezone,
      currency,
      theme,
      viewMode,
      twoFactorEnabled,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    // Settings saved - show success message (will add toast later)
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      logout();
      navigate("/welcome");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Please log in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="bg-transparent text-white hover:bg-white/5 hover:text-white -ml-4"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-medium mb-2">Settings</h1>
              <p className="text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/account")}
              className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="account" className="data-[state=active]:bg-white data-[state=active]:text-black text-white data-[state=inactive]:text-gray-300">
              Account
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:text-black text-white data-[state=inactive]:text-gray-300">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-black text-white data-[state=inactive]:text-gray-300">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:text-black text-white data-[state=inactive]:text-gray-300">
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="bg-black border border-white/10 rounded-lg p-8 space-y-8">
              {/* Email */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Address
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-white/60">Current Email</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-white/5 border-white/10 text-white/60 mt-2"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Contact support to change your email address
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Password */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/60">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 pr-10 focus:bg-white/10"
                      />
                      <button
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        type="button"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/60">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 pr-10 focus:bg-white/10"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        type="button"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/60">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-400 text-sm" role="alert">{passwordError}</p>
                  )}

                  <Button
                    onClick={handlePasswordChange}
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white font-medium">Enable 2FA</p>
                    <p className="text-gray-400 text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      Two-factor authentication is enabled. You'll need to enter a
                      code from your authenticator app when logging in.
                    </p>
                  </div>
                )}
              </div>

              <Separator className="bg-white/10" />

              {/* Delete Account */}
              <div>
                <h3 className="text-red-400 text-lg font-medium mb-4">
                  Delete Account
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be
                  certain.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <div className="bg-black border border-white/10 rounded-lg p-8 space-y-6">
              <h3 className="text-white text-lg font-medium flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/60 mb-2 block">
                    Profile Visibility
                  </Label>
                  <Select
                    value={profileVisibility}
                    onValueChange={(value: "public" | "followers" | "private") =>
                      setProfileVisibility(value)
                    }
                  >
                    <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                      <SelectItem value="public" className="text-white">Public - Anyone can view</SelectItem>
                      <SelectItem value="followers" className="text-white">
                        Followers Only - Only your followers
                      </SelectItem>
                      <SelectItem value="private" className="text-white">
                        Private - Only you
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-400 text-xs mt-1">
                    Control who can see your profile
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white font-medium">Show Email Address</p>
                    <p className="text-gray-400 text-sm">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white font-medium">Show Statistics</p>
                    <p className="text-gray-400 text-sm">
                      Display follower counts and likes on your profile
                    </p>
                  </div>
                  <Switch checked={showStats} onCheckedChange={setShowStats} />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-white font-medium">
                      Search Engine Indexing
                    </p>
                    <p className="text-gray-400 text-sm">
                      Allow search engines to index your profile
                    </p>
                  </div>
                  <Switch checked={indexable} onCheckedChange={setIndexable} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-black border border-white/10 rounded-lg p-8 space-y-8">
              {/* Email Notifications */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">New Followers</p>
                      <p className="text-gray-400 text-sm">
                        When someone follows you
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.newFollower}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          newFollower: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">Likes</p>
                      <p className="text-gray-400 text-sm">
                        When someone likes your work
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.likes}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          likes: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">Comments</p>
                      <p className="text-gray-400 text-sm">
                        When someone comments on your work
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.comments}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          comments: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">Messages</p>
                      <p className="text-gray-400 text-sm">
                        When you receive a new message
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.messages}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          messages: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">System Updates</p>
                      <p className="text-gray-400 text-sm">
                        Important platform updates and announcements
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.systemUpdates}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          systemUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">Marketing</p>
                      <p className="text-gray-400 text-sm">
                        Tips, promotions, and newsletters
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.marketing}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          marketing: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Notification Frequency */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Frequency
                </h3>
                <Select
                  value={notificationFrequency}
                  onValueChange={(value: "realtime" | "daily" | "weekly") =>
                    setNotificationFrequency(value)
                  }
                >
                  <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                    <SelectItem value="realtime" className="text-white">Real-time - As they happen</SelectItem>
                    <SelectItem value="daily" className="text-white">Daily Digest - Once per day</SelectItem>
                    <SelectItem value="weekly" className="text-white">Weekly Summary - Once per week</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-gray-400 text-xs mt-2">
                  Choose how often you want to receive email notifications
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="bg-black border border-white/10 rounded-lg p-8 space-y-6">
              <h3 className="text-white text-lg font-medium flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Platform Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-white/60 mb-2 block">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                      <SelectItem value="en" className="text-white">English</SelectItem>
                      <SelectItem value="es" className="text-white">Español</SelectItem>
                      <SelectItem value="fr" className="text-white">Français</SelectItem>
                      <SelectItem value="de" className="text-white">Deutsch</SelectItem>
                      <SelectItem value="zh" className="text-white">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60 mb-2 block">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                        <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                        <SelectItem value="America/New_York" className="text-white">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles" className="text-white">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London" className="text-white">London</SelectItem>
                        <SelectItem value="Asia/Tokyo" className="text-white">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/60 mb-2 block">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                        <SelectItem value="USD" className="text-white">USD ($)</SelectItem>
                        <SelectItem value="EUR" className="text-white">EUR (€)</SelectItem>
                        <SelectItem value="GBP" className="text-white">GBP (£)</SelectItem>
                        <SelectItem value="JPY" className="text-white">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white/60 mb-2 block">Theme</Label>
                  <Select value={theme} onValueChange={(value: "light" | "dark" | "auto") => setTheme(value)}>
                    <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                      <SelectItem value="light" className="text-white">Light</SelectItem>
                      <SelectItem value="dark" className="text-white">Dark</SelectItem>
                      <SelectItem value="auto" className="text-white">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose your preferred color scheme
                  </p>
                </div>

                <div>
                  <Label className="text-white/60 mb-2 block">View Mode</Label>
                  <Select value={viewMode} onValueChange={(value: "grid" | "list") => setViewMode(value)}>
                    <SelectTrigger className="bg-transparent border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/30 shadow-xl">
                      <SelectItem value="grid" className="text-white">Grid View</SelectItem>
                      <SelectItem value="list" className="text-white">List View</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-400 text-xs mt-1">
                    Default layout for browsing content
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-4">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-white text-black hover:bg-white/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save All Settings"}
          </Button>
          <p className="text-gray-400 text-sm">
            Click 'Save All Settings' to persist your changes
          </p>
        </div>
      </div>
    </div>
  );
}

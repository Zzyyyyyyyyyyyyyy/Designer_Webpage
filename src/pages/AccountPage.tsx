import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, WorkExperience, Education } from "../contexts/AuthContext";
import {
  User,
  Camera,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Plus,
  X,
  Save,
  Award,
  GraduationCap,
  Settings as SettingsIcon,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";

export function AccountPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.profile.fullName || "");
  const [username, setUsername] = useState(user?.profile.username || "");
  const [profession, setProfession] = useState(user?.profile.profession || "");
  const [bio, setBio] = useState(user?.profile.bio || "");
  const [about, setAbout] = useState(user?.profile.about || "");
  const [location, setLocation] = useState(user?.profile.location || "");
  const [services, setServices] = useState(user?.profile.services || "");
  const [priceRange, setPriceRange] = useState(user?.profile.priceRange || "");
  const [isAvailable, setIsAvailable] = useState(user?.profile.isAvailable || false);
  const [avatar, setAvatar] = useState(user?.profile.avatar || "");

  // Skills
  const [skills, setSkills] = useState<string[]>(user?.profile.skills || []);
  const [newSkill, setNewSkill] = useState("");

  // Certifications
  const [certifications, setCertifications] = useState<string[]>(
    user?.profile.certifications || []
  );
  const [newCertification, setNewCertification] = useState("");

  // Social Links
  const [socialLinks, setSocialLinks] = useState(
    user?.profile.socialLinks || {}
  );

  // Experience
  const [experience, setExperience] = useState<WorkExperience[]>(
    user?.profile.experience || []
  );

  // Education
  const [education, setEducation] = useState<Education[]>(
    user?.profile.education || []
  );

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddCertification = () => {
    if (
      newCertification.trim() &&
      !certifications.includes(newCertification.trim())
    ) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Update profile
    updateProfile({
      fullName,
      username,
      profession,
      bio,
      about,
      location,
      services,
      priceRange,
      isAvailable,
      avatar,
      skills,
      certifications,
      socialLinks,
      experience,
      education,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFullName(user?.profile.fullName || "");
    setUsername(user?.profile.username || "");
    setProfession(user?.profile.profession || "");
    setBio(user?.profile.bio || "");
    setAbout(user?.profile.about || "");
    setLocation(user?.profile.location || "");
    setServices(user?.profile.services || "");
    setPriceRange(user?.profile.priceRange || "");
    setIsAvailable(user?.profile.isAvailable || false);
    setAvatar(user?.profile.avatar || "");
    setSkills(user?.profile.skills || []);
    setCertifications(user?.profile.certifications || []);
    setSocialLinks(user?.profile.socialLinks || {});
    setExperience(user?.profile.experience || []);
    setEducation(user?.profile.education || []);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Please log in to view your account.</p>
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
              <h1 className="text-white text-3xl font-medium mb-2">
                Account Profile
              </h1>
              <p className="text-gray-400">
                Manage your public profile information
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
              className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-black border border-white/10 rounded-lg p-8">
          {/* Avatar Section */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white/40" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-white text-black rounded-full p-2 border-2 border-black hover:bg-white/90 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-white text-2xl font-medium">
                  {fullName || user.email}
                </h2>
                {user.profile.isAvailable && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                    Available for work
                  </span>
                )}
              </div>
              {profession && (
                <p className="text-gray-400 mb-2">{profession}</p>
              )}
              {location && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
              )}
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-white text-black hover:bg-white/90"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Full Name</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">Username</Label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="@username"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Profession</Label>
                      <Input
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="e.g., UI/UX Designer"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/60">Bio (150 chars)</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) =>
                        e.target.value.length <= 150 && setBio(e.target.value)
                      }
                      placeholder="A short introduction about yourself"
                      className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 resize-none focus:bg-white/10"
                      rows={2}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      {bio.length}/150
                    </p>
                  </div>

                  <div>
                    <Label className="text-white/60">About (500 chars)</Label>
                    <Textarea
                      value={about}
                      onChange={(e) =>
                        e.target.value.length <= 500 && setAbout(e.target.value)
                      }
                      placeholder="Tell us more about your background, experience, and what you do"
                      className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 resize-none focus:bg-white/10"
                      rows={4}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      {about.length}/500
                    </p>
                  </div>

                  <div>
                    <Label className="text-white/60">Email</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-white/5 border-white/10 text-white/60 mt-2"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Email cannot be changed here
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Professional Information */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Services Offered</Label>
                      <Input
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                        placeholder="e.g., Brand Identity, UI Design"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">Price Range</Label>
                      <Input
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="e.g., $500 - $2000"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <p className="text-white font-medium">
                        Available for work
                      </p>
                      <p className="text-gray-400 text-sm">
                        Show that you're open to new projects
                      </p>
                    </div>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <Label className="text-white/60">Skills</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add a skill"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:bg-white/10"
                      />
                      <Button
                        onClick={handleAddSkill}
                        variant="outline"
                        className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
                        aria-label="Add skill"
                        title="Add skill"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20 flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <Label className="text-white/60 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Certifications & Awards
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCertification();
                          }
                        }}
                        placeholder="Add a certification or award"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:bg-white/10"
                      />
                      <Button
                        onClick={handleAddCertification}
                        variant="outline"
                        className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
                        aria-label="Add certification"
                        title="Add certification or award"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-3">
                      {certifications.map((cert) => (
                        <div
                          key={cert}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <span className="text-white text-sm">{cert}</span>
                          <button
                            onClick={() => handleRemoveCertification(cert)}
                            className="text-white/60 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Social Links */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Social Links
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-white/60">Website</Label>
                    <Input
                      value={socialLinks.website || ""}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                      className="bg-transparent border-white/20 text-white mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Behance</Label>
                      <Input
                        value={socialLinks.behance || ""}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            behance: e.target.value,
                          })
                        }
                        placeholder="behance.net/username"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">Dribbble</Label>
                      <Input
                        value={socialLinks.dribbble || ""}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            dribbble: e.target.value,
                          })
                        }
                        placeholder="dribbble.com/username"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60">Instagram</Label>
                      <Input
                        value={socialLinks.instagram || ""}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="@username"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60">LinkedIn</Label>
                      <Input
                        value={socialLinks.linkedin || ""}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="linkedin.com/in/username"
                        className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 mt-2 focus:bg-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Display Mode */}
              {bio && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2">Bio</h3>
                  <p className="text-white">{bio}</p>
                </div>
              )}

              {about && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2">About</h3>
                  <p className="text-white whitespace-pre-wrap">{about}</p>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(services || priceRange) && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2">Services</h3>
                  <div className="space-y-2">
                    {services && <p className="text-white">{services}</p>}
                    {priceRange && (
                      <p className="text-gray-400 text-sm">
                        Price range: {priceRange}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certifications & Awards
                  </h3>
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div
                        key={cert}
                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <p className="text-white text-sm">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(socialLinks).length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Links
                  </h3>
                  <div className="space-y-2">
                    {socialLinks.website && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-white hover:text-white/70 transition-colors"
                      >
                        {socialLinks.website}
                      </a>
                    )}
                    {socialLinks.behance && (
                      <a
                        href={`https://behance.net/${socialLinks.behance}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-white hover:text-white/70 transition-colors"
                      >
                        Behance: {socialLinks.behance}
                      </a>
                    )}
                    {socialLinks.dribbble && (
                      <a
                        href={`https://dribbble.com/${socialLinks.dribbble}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-white hover:text-white/70 transition-colors"
                      >
                        Dribbble: {socialLinks.dribbble}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl text-white font-medium">
                      {user.profile.followers}
                    </p>
                    <p className="text-gray-400 text-sm">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-white font-medium">
                      {user.profile.following}
                    </p>
                    <p className="text-gray-400 text-sm">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl text-white font-medium">
                      {user.profile.likes}
                    </p>
                    <p className="text-gray-400 text-sm">Likes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

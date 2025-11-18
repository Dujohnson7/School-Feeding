import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, BookOpen, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  school?: string;
  district?: string;
};

export function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState<ProfileData>({
    id: user?.id || "",
    name: user?.names || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    school: user?.school || "",
    district: user?.district || "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !user?.id) {
        toast.error("Authentication Required", {
          description: "Please login to view your profile.",
        });
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8070/api/profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(prev => ({
          ...prev,
          ...data,
          name: data.names || data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          school: typeof data.school === 'object' ? data.school?.name : data.school || prev.school,
          district: typeof data.district === 'object' ? data.district?.district || data.district?.name : data.district || prev.district,
        }));
        
        // Update localStorage with fetched data
        const updatedUser = {
          ...user,
          names: data.names || data.name,
          name: data.names || data.name,
          email: data.email,
          phone: data.phone,
          profile: data.profile,
          school: data.school,
          district: data.district,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error Loading Profile", {
          description: "Failed to load profile data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, user?.id, navigate]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB max
        toast.error("File Too Large", {
          description: "Image must be less than 1MB.",
        });
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    if (!profile.name || !profile.email) {
      toast.error("Validation Error", {
        description: "Name and email are required fields.",
      });
      return;
    }

    if (!token || !user?.id) {
      toast.error("Authentication Error", {
        description: "Please login to update your profile.",
      });
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("names", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone || "");
      
      // Add profile image if selected
      if (profileImage) {
        formData.append("userProfile", profileImage);
      }

      const response = await fetch(`http://localhost:8070/api/profile/update/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header, browser will set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      const updatedUser = { 
        ...user, 
        names: updatedData.names || profile.name,
        name: updatedData.names || profile.name,
        email: updatedData.email || profile.email,
        phone: updatedData.phone || profile.phone,
        profile: updatedData.profile || user.profile
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update local profile state
      setProfile(prev => ({
        ...prev,
        name: updatedData.names || prev.name,
        email: updatedData.email || prev.email,
        phone: updatedData.phone || prev.phone,
      }));

      // Clear image selection after successful upload
      setProfileImage(null);
      setProfileImagePreview(null);

      toast.success("Profile Updated Successfully", {
        description: "Your profile information has been successfully updated.",
        duration: 4000,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Profile Update Failed", {
        description: error.message || "We couldn't update your profile. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error("Validation Error", {
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (security.newPassword.length < 6) {
      toast.error("Invalid Password", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (security.newPassword !== security.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New password and confirmation do not match.",
      });
      return;
    }

    if (!token || !user?.id) {
      toast.error("Authentication Error", {
        description: "Your session has expired. Please login again.",
      });
      navigate("/login");
      return;
    }

    setIsChangingPassword(true);
    try {
      // First verify current password
      const checkPasswordResponse = await fetch(`http://localhost:8070/api/profile/checkPassword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: user.id,
          password: security.currentPassword,
        }),
      });

      if (!checkPasswordResponse.ok) {
        throw new Error("Current password is incorrect");
      }

      // If password is correct, change it
      const response = await fetch(`http://localhost:8070/api/profile/changePassword/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: security.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      toast.success("Password Changed Successfully", {
        description: "Your password has been changed successfully. Please use your new password for future logins.",
        duration: 5000,
      });

      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error("Password Change Failed", {
        description: error.message || "We couldn't update your password. Please check your current password and try again.",
        duration: 5000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="flex-1">
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/profile" className="lg:hidden">
            <BookOpen className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Profile Settings</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage 
                            src={
                              profileImagePreview 
                                ? profileImagePreview 
                                : user?.profile 
                                  ? `http://localhost:8070/uploads/${user.profile}`
                                  : "/userIcon.png"
                            } 
                            alt="Profile picture" 
                          />
                          <AvatarFallback className="text-lg">
                            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            type="file"
                            id="profileImage"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => document.getElementById('profileImage')?.click()}
                          >
                            Change Photo
                          </Button>
                          <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input id="role" value={profile.role} readOnly />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {profile.role !== "ADMIN" && profile.role !== "GOV" && (
                          <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input id="district" value={profile.district || ""} readOnly />
                          </div>
                        )}
                        {profile.role !== "ADMIN" && profile.role !== "GOV" && profile.role !== "DISTRICT" && profile.role !== "SUPPLIER" && (
                          <div className="space-y-2">
                            <Label htmlFor="school">School</Label>
                            <Input id="school" value={profile.school || ""} readOnly />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={security.currentPassword}
                            onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={security.newPassword}
                            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={security.confirmPassword}
                            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              'Update Password'
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;

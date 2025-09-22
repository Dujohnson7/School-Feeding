
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, BookOpen, Calendar, FileText, Home, LogOut, Package, Save, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export function Profile() {
  const [profile, setProfile] = useState({
    firstName: "Jean Baptiste",
    lastName: "Uwimana",
    email: "jean.uwimana@school.edu.rw",
    phone: "+250 788 123 456",
    school: "Kigali Primary School",
    district: "Gasabo District",
    bio: "Experienced school administrator with over 10 years in educational management.",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true,
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  const handleProfileSave = () => {
    console.log("Saving profile:", profile)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const handleNotificationsSave = () => {
    console.log("Saving notifications:", notifications)
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handlePasswordChange = () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    console.log("Changing password")
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
    setSecurity({ ...security, currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <BookOpen className="mr-2 h-6 w-6" />
          <h2 className="text-lg font-semibold">School Admin</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/school-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/request-food"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Request Food
            </Link>
            <Link
              to="/track-delivery"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Calendar className="h-4 w-4" />
              Track Delivery
            </Link>
            <Link
              to="/school-reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Link
              to="/manage-stock-managers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              Manage Staff
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-primary-foreground/10 text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="#" className="lg:hidden">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>JU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Jean Baptiste Uwimana</p>
                    <p className="text-xs leading-none text-muted-foreground">jean.uwimana@school.edu.rw</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                        <AvatarFallback className="text-lg">JU</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline">Change Photo</Button>
                        <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
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
                      <div className="space-y-2">
                        <Label htmlFor="school">School</Label>
                        <Input
                          id="school"
                          value={profile.school}
                          onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={profile.district}
                          onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleProfileSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified about system updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                        </div>
                        <Switch
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive critical system alerts</p>
                        </div>
                        <Switch
                          checked={notifications.systemAlerts}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleNotificationsSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        />
                      </div>

                      <Button onClick={handlePasswordChange}>Change Password</Button>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={security.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile

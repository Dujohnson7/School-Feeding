
import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, FileText, Home, LogOut, Save, Settings, Shield, Users } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function AdminSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Digital School Feeding System",
    systemDescription: "Comprehensive school feeding management system for Rwanda",
    timezone: "Africa/Kigali",
    language: "en",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    enableTwoFactor: false,
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "system@schoolfeeding.rw",
    smtpPassword: "",
    fromEmail: "noreply@schoolfeeding.rw",
    fromName: "School Feeding System",
    enableSsl: true,
  })

  const [backupSettings, setBackupSettings] = useState({
    enableAutoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionDays: "30",
    backupLocation: "cloud",
    enableNotifications: true,
  })

  const handleGeneralSave = () => {
    console.log("Saving general settings:", generalSettings)
    toast({
      title: "Settings Saved",
      description: "General system settings have been updated successfully.",
    })
  }

  const handleEmailSave = () => {
    console.log("Saving email settings:", emailSettings)
    toast({
      title: "Email Settings Saved",
      description: "Email configuration has been updated successfully.",
    })
  }

  const handleBackupSave = () => {
    console.log("Saving backup settings:", backupSettings)
    toast({
      title: "Backup Settings Saved",
      description: "Backup configuration has been updated successfully.",
    })
  }

  const handleTestEmail = () => {
    console.log("Testing email configuration...")
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to verify the configuration.",
    })
  }

  const handleBackupNow = () => {
    console.log("Starting manual backup...")
    toast({
      title: "Backup Started",
      description: "Manual backup has been initiated. You will be notified when complete.",
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          <h2 className="text-lg font-semibold">System Admin</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/admin-users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              User Management
            </Link>
            <Link
              to="/admin-logs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Audit Logs
            </Link>
            <Link
              to="/admin-settings"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              System Settings
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
          <Link href="#" className="lg:hidden">
            <Shield className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">System Settings</h1>
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
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">System Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@system.rw</p>
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
              <h2 className="text-2xl font-bold">System Settings</h2>
              <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure basic system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="systemName">System Name</Label>
                        <Input
                          id="systemName"
                          value={generalSettings.systemName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={generalSettings.timezone}
                          onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Kigali">Africa/Kigali (GMT+2)</SelectItem>
                            <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                            <SelectItem value="Africa/Nairobi">Africa/Nairobi (GMT+3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemDescription">System Description</Label>
                      <Textarea
                        id="systemDescription"
                        value={generalSettings.systemDescription}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, systemDescription: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable maintenance mode to prevent user access
                          </p>
                        </div>
                        <Switch
                          checked={generalSettings.maintenanceMode}
                          onCheckedChange={(checked) =>
                            setGeneralSettings({ ...generalSettings, maintenanceMode: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                        </div>
                        <Switch
                          checked={generalSettings.allowRegistration}
                          onCheckedChange={(checked) =>
                            setGeneralSettings({ ...generalSettings, allowRegistration: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Require Email Verification</Label>
                          <p className="text-sm text-muted-foreground">Require users to verify their email address</p>
                        </div>
                        <Switch
                          checked={generalSettings.requireEmailVerification}
                          onCheckedChange={(checked) =>
                            setGeneralSettings({ ...generalSettings, requireEmailVerification: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
                        </div>
                        <Switch
                          checked={generalSettings.enableTwoFactor}
                          onCheckedChange={(checked) =>
                            setGeneralSettings({ ...generalSettings, enableTwoFactor: checked })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={handleGeneralSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save General Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Configuration</CardTitle>
                    <CardDescription>Configure SMTP settings for system emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={emailSettings.smtpHost}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          value={emailSettings.smtpPort}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input
                          id="smtpUsername"
                          value={emailSettings.smtpUsername}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromName">From Name</Label>
                        <Input
                          id="fromName"
                          value={emailSettings.fromName}
                          onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable SSL/TLS</Label>
                        <p className="text-sm text-muted-foreground">Use secure connection for SMTP</p>
                      </div>
                      <Switch
                        checked={emailSettings.enableSsl}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableSsl: checked })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleEmailSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Email Settings
                      </Button>
                      <Button variant="outline" onClick={handleTestEmail}>
                        Test Email Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup Configuration</CardTitle>
                    <CardDescription>Configure automated backup settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Automatic Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                      </div>
                      <Switch
                        checked={backupSettings.enableAutoBackup}
                        onCheckedChange={(checked) =>
                          setBackupSettings({ ...backupSettings, enableAutoBackup: checked })
                        }
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select
                          value={backupSettings.backupFrequency}
                          onValueChange={(value) => setBackupSettings({ ...backupSettings, backupFrequency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupTime">Backup Time</Label>
                        <Input
                          id="backupTime"
                          type="time"
                          value={backupSettings.backupTime}
                          onChange={(e) => setBackupSettings({ ...backupSettings, backupTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="retentionDays">Retention Period (Days)</Label>
                        <Input
                          id="retentionDays"
                          type="number"
                          value={backupSettings.retentionDays}
                          onChange={(e) => setBackupSettings({ ...backupSettings, retentionDays: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupLocation">Backup Location</Label>
                        <Select
                          value={backupSettings.backupLocation}
                          onValueChange={(value) => setBackupSettings({ ...backupSettings, backupLocation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">Local Storage</SelectItem>
                            <SelectItem value="cloud">Cloud Storage</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Backup Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about backup status</p>
                      </div>
                      <Switch
                        checked={backupSettings.enableNotifications}
                        onCheckedChange={(checked) =>
                          setBackupSettings({ ...backupSettings, enableNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={handleBackupSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Backup Settings
                      </Button>
                      <Button variant="outline" onClick={handleBackupNow}>
                        Backup Now
                      </Button>
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


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
    systemName: "School Feeding",
    systemDescription: "School feeding management system for Rwanda", 
    systemEmail: "schoolfeeding.info@gmail.com",
    maintenanceMode: false,
    allowRegistration: false,
    requireEmailVerification: true, 
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "schoolfeeding.info@gmail.com",
    smtpPassword: "vghk tmff cbpd meiy",
    fromEmail: "schoolfeeding.info@gmail.com",
    fromName: "School Feeding",
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

  

  return (
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Link to="/admin-dashboard" className="lg:hidden">
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
                        <Label htmlFor="timezone">System Email</Label> 
                        <Input
                          id="systemEmail"
                          value={generalSettings.systemEmail}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, systemEmail: e.target.value })}
                        />
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
 
                    </div>

                    <Button onClick={handleGeneralSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save General Settings
                    </Button>
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

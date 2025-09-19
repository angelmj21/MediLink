import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pill, Clock, Bell, Calendar, AlertCircle } from "lucide-react"

const Medications = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "8:00 AM",
      reminders: true,
      remaining: 25,
      refillDate: "2024-02-15",
      status: "active"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "8:00 AM, 8:00 PM",
      reminders: true,
      remaining: 45,
      refillDate: "2024-02-20",
      status: "active"
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "8:00 AM",
      reminders: true,
      remaining: 8,
      refillDate: "2024-01-25",
      status: "low"
    },
    {
      id: 4,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "As needed",
      time: "When required",
      reminders: false,
      remaining: 100,
      refillDate: "2024-03-01",
      status: "prn"
    }
  ]

  const todaySchedule = [
    { name: "Lisinopril", time: "8:00 AM", taken: true },
    { name: "Metformin", time: "8:00 AM", taken: true },
    { name: "Vitamin D3", time: "8:00 AM", taken: true },
    { name: "Metformin", time: "8:00 PM", taken: false },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "low": return "destructive"
      case "prn": return "secondary"
      default: return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active"
      case "low": return "Low Stock"
      case "prn": return "As Needed"
      default: return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-muted-foreground">Manage your medications and set reminders</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details for your new medication</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medName">Medication Name</Label>
                <Input id="medName" placeholder="Enter medication name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input id="dosage" placeholder="e.g., 10mg" />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once daily</SelectItem>
                      <SelectItem value="twice">Twice daily</SelectItem>
                      <SelectItem value="three">Three times daily</SelectItem>
                      <SelectItem value="four">Four times daily</SelectItem>
                      <SelectItem value="asneeded">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="time">Reminder Time(s)</Label>
                <Input id="time" placeholder="e.g., 8:00 AM" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="reminders" />
                <Label htmlFor="reminders">Enable push notifications</Label>
              </div>
              <Button className="w-full" onClick={() => setShowAddDialog(false)}>
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your medication schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((med, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${med.taken ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/50'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.time}</p>
                    </div>
                  </div>
                  {med.taken && <span className="text-xs text-green-600 dark:text-green-400">✓ Taken</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Medications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              All Medications
            </CardTitle>
            <CardDescription>Your complete medication list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{med.name}</h3>
                      <Badge variant={getStatusColor(med.status)} className="text-xs">
                        {getStatusText(med.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Dosage: {med.dosage}</span>
                      <span>•</span>
                      <span>{med.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{med.time}</span>
                      {med.reminders && <Bell className="h-3 w-3 text-primary" />}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      {med.remaining <= 10 && <AlertCircle className="h-3 w-3 text-destructive" />}
                      <span className={med.remaining <= 10 ? "text-destructive font-medium" : "text-muted-foreground"}>
                        {med.remaining} pills left
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Refill: {new Date(med.refillDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Medications</p>
                <p className="text-2xl font-bold">{medications.length}</p>
              </div>
              <Pill className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Prescriptions</p>
                <p className="text-2xl font-bold">{medications.filter(med => med.status === 'active').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-destructive">{medications.filter(med => med.remaining <= 10).length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reminders Active</p>
                <p className="text-2xl font-bold">{medications.filter(med => med.reminders).length}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Medications
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Activity, Heart, Pill, Calendar, Download } from "lucide-react"

const Analytics = () => {
  const healthMetrics = [
    { 
      name: "Medication Adherence", 
      value: "94%", 
      change: "+2%", 
      trend: "up",
      description: "7-day average" 
    },
    { 
      name: "Blood Pressure", 
      value: "122/78", 
      change: "-4/2", 
      trend: "up",
      description: "vs last month" 
    },
    { 
      name: "Weight", 
      value: "68.2 kg", 
      change: "-0.5kg", 
      trend: "up",
      description: "vs last week" 
    },
    { 
      name: "Heart Rate", 
      value: "72 bpm", 
      change: "-3 bpm", 
      trend: "up",
      description: "resting average" 
    }
  ]

  const medicationData = [
    { name: "Lisinopril", adherence: 98, trend: "stable" },
    { name: "Metformin", adherence: 92, trend: "improving" },
    { name: "Vitamin D3", adherence: 89, trend: "declining" },
    { name: "Aspirin", adherence: 95, trend: "stable" }
  ]

  const appointmentHistory = [
    { date: "2024-01-15", type: "Cardiology", provider: "Dr. Smith", notes: "Blood pressure check" },
    { date: "2024-01-08", type: "General", provider: "Dr. Johnson", notes: "Annual checkup" },
    { date: "2023-12-20", type: "Lab Work", provider: "LabCorp", notes: "Blood panel" },
    { date: "2023-12-01", type: "Ophthalmology", provider: "Dr. Lee", notes: "Eye exam" }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600"
    if (percentage >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "improving": return <Badge variant="default" className="bg-green-100 text-green-800">Improving</Badge>
      case "declining": return <Badge variant="destructive">Declining</Badge>
      case "stable": return <Badge variant="secondary">Stable</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Health Analytics</h1>
          <p className="text-muted-foreground">Track your health trends and medication adherence</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground">{metric.description}</span>
                  </div>
                </div>
                <Heart className="h-8 w-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medication Adherence Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Medication Adherence
            </CardTitle>
            <CardDescription>Your medication taking consistency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chart placeholder */}
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Adherence chart would be displayed here</p>
                </div>
              </div>
              
              {/* Medication breakdown */}
              <div className="space-y-3">
                {medicationData.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className={`text-lg font-bold ${getAdherenceColor(med.adherence)}`}>
                        {med.adherence}%
                      </p>
                    </div>
                    {getTrendBadge(med.trend)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Health Trends
            </CardTitle>
            <CardDescription>Your vital signs and health metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chart placeholder */}
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Health trends chart would be displayed here</p>
                </div>
              </div>
              
              {/* Quick insights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">Blood Pressure</p>
                  <p className="font-bold text-green-800 dark:text-green-200">Improving</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">Weight</p>
                  <p className="font-bold text-blue-800 dark:text-blue-200">Stable</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Appointments
          </CardTitle>
          <CardDescription>Your healthcare visits and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentHistory.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{appointment.type}</h3>
                    <Badge variant="outline">{appointment.provider}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.ceil((Date.now() - new Date(appointment.date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Overall Health Score
          </CardTitle>
          <CardDescription>Based on your medication adherence, vital signs, and appointment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 bg-muted rounded-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">87</p>
                <p className="text-sm text-muted-foreground">Health Score</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-sm text-muted-foreground">Medication</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">8.5</p>
              <p className="text-sm text-muted-foreground">Vitals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">4</p>
              <p className="text-sm text-muted-foreground">Checkups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics
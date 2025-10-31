import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Heart, Pill, Activity, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

// 🔹 Import Firestore
import { db } from "../firebase-Config"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"

const Dashboard = () => {
  const navigate = useNavigate()

  // Firestore document path for storing profile
  const PROFILE_DOC = doc(db, "users", "demoUser")

  type PersonalDetails = { name: string; age: number | ""; gender: string }
  type Medication = {
    id: number
    name: string
    dosage: string
    frequency: string
    time?: string
    timeSlots?: string[]
    reminders: boolean
    remaining: number
    refillDate: string
    status: string
  }

  const [personal, setPersonal] = useState<PersonalDetails>({
    name: "John",
    age: 30,
    gender: "Other",
  })

  const [editOpen, setEditOpen] = useState(false)
  const [nameInput, setNameInput] = useState(personal.name)
  const [ageInput, setAgeInput] = useState<number | "">(personal.age)
  const [genderInput, setGenderInput] = useState(personal.gender)

  const [medications, setMedications] = useState<Medication[]>([])
  const [activities, setActivities] = useState<{ type: string; description: string; date: string }[]>([])

  // Add Appointment dialog state
  const [addApptOpen, setAddApptOpen] = useState(false)
  const [doctorName, setDoctorName] = useState("")
  const [department, setDepartment] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")

  // 🔹 Load personal details and medications from Firestore on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(PROFILE_DOC)
        if (snap.exists()) {
          const data = snap.data() as any
          if (data?.name) setPersonal({ name: data.name, age: data.age ?? "", gender: data.gender ?? "Other" })
          if (data?.name) setNameInput(data.name)
          if (data?.age !== undefined) setAgeInput(data.age)
          if (data?.gender) setGenderInput(data.gender)
          if (Array.isArray(data?.medications)) setMedications(data.medications as Medication[])
          if (Array.isArray(data?.activities)) setActivities(data.activities as any)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }
    fetchData()
  }, [])

  // 🔄 Refresh when returning to Dashboard (tab visibility change)
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const snap = await getDoc(PROFILE_DOC)
          if (snap.exists()) {
            const data = snap.data() as any
            if (data?.name) setPersonal({ name: data.name, age: data.age ?? "", gender: data.gender ?? "Other" })
            if (data?.name) setNameInput(data.name)
            if (data?.age !== undefined) setAgeInput(data.age)
            if (data?.gender) setGenderInput(data.gender)
            if (Array.isArray(data?.medications)) setMedications(data.medications as Medication[])
            if (Array.isArray(data?.activities)) setActivities(data.activities as any)
          }
        } catch (err) {
          console.error("Error refreshing profile:", err)
        }
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // 🔔 Realtime updates for medications
  useEffect(() => {
    const unsub = onSnapshot(PROFILE_DOC, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any
        if (Array.isArray(data?.medications)) setMedications(data.medications as Medication[])
        if (Array.isArray(data?.activities)) setActivities(data.activities as any)
      }
    })
    return () => unsub()
  }, [])

  // 🔹 Save personal details to Firestore
  const savePersonal = async () => {
    const normalized: PersonalDetails = {
      name: nameInput.trim() || personal.name,
      age: ageInput === "" ? personal.age : Number(ageInput) || personal.age,
      gender: genderInput.trim() || personal.gender,
    }
    try {
      await setDoc(PROFILE_DOC, normalized)
      setPersonal(normalized)
      setEditOpen(false)
    } catch (err) {
      console.error("Error saving profile:", err)
    }
  }

  // Sample health, meds, activity
  const healthMetrics = [
    { label: "Blood Pressure", value: "120/80", status: "normal", icon: Heart, color: "text-green-600" },
    { label: "Heart Rate", value: "72 bpm", status: "normal", icon: Activity, color: "text-green-600" },
    { label: "Weight", value: "68 kg", status: "stable", icon: Activity, color: "text-blue-600" },
  ]

  const buildTodaySchedule = () => {
    const items: { name: string; time: string; dosage: string }[] = []
    medications.forEach((m) => {
      if ((m.frequency || '').toLowerCase() === 'as needed') return
      const slots = Array.isArray(m.timeSlots) && m.timeSlots.length
        ? m.timeSlots
        : (typeof m.time === 'string' && m.time ? m.time.split(',').map(s => s.trim()).filter(Boolean) : [])
      slots.forEach((slot) => {
        items.push({ name: m.name, time: slot, dosage: m.dosage })
      })
    })
    // Optional: sort by time if in HH:MM AM/PM
    const parseTime = (t: string) => {
      const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (!match) return Number.MAX_SAFE_INTEGER
      let h = parseInt(match[1], 10)
      const m = parseInt(match[2], 10)
      const ap = match[3].toUpperCase()
      if (ap === 'PM' && h !== 12) h += 12
      if (ap === 'AM' && h === 12) h = 0
      return h * 60 + m
    }
    items.sort((a, b) => parseTime(a.time) - parseTime(b.time))
    return items
  }
  const upcomingMeds = buildTodaySchedule()

  const saveAppointment = async () => {
    if (!doctorName.trim() || !appointmentDate) return
    const entry = {
      type: "Appointment",
      description: `${doctorName.trim()}${department.trim() ? ` - ${department.trim()}` : ''}`,
      date: new Date(appointmentDate).toLocaleDateString(),
    }
    const next = [entry, ...activities]
    try {
      await setDoc(PROFILE_DOC, { activities: next }, { merge: true })
      setActivities(next)
      setAddApptOpen(false)
      setDoctorName("")
      setDepartment("")
      setAppointmentDate("")
    } catch (err) {
      console.error("Error saving appointment:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {personal.name}!</h1>
          <p className="text-muted-foreground mt-1">Here's your health overview for today</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Health Metrics removed per requirement */}

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Personal Details</DialogTitle>
                  <DialogDescription>Update your profile information.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pd-name">Full Name</Label>
                    <Input id="pd-name" placeholder="Your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pd-age">Age</Label>
                      <Input id="pd-age" type="number" placeholder="e.g., 30" value={ageInput} onChange={(e) => setAgeInput(e.target.value === "" ? "" : Number(e.target.value))} />
                    </div>
                    <div>
                      <Label htmlFor="pd-gender">Gender</Label>
                      <Input id="pd-gender" placeholder="Male/Female/Other" value={genderInput} onChange={(e) => setGenderInput(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => { setNameInput(personal.name); setAgeInput(personal.age); setGenderInput(personal.gender); setEditOpen(false) }}>Cancel</Button>
                    <Button onClick={savePersonal}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{personal.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium">{personal.age}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{personal.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medications & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Today's Medications
                </CardTitle>
                <CardDescription>Upcoming medication reminders</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/medications')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMeds.map((med, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{med.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest health updates</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={addApptOpen} onOpenChange={setAddApptOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Add Appointment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Appointment</DialogTitle>
                      <DialogDescription>Log an upcoming or past doctor visit.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="doc-name">Doctor's Name</Label>
                        <Input id="doc-name" placeholder="e.g., Dr. Smith" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="dept">Department/Specialty</Label>
                        <Input id="dept" placeholder="e.g., Cardiology" value={department} onChange={(e) => setDepartment(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="appt-date">Date</Label>
                        <Input id="appt-date" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                      </div>
                      <Button className="w-full" onClick={saveAppointment}>Save Appointment</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                  View History
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/medications')}>
              <Pill className="h-6 w-6" />
              <span className="text-sm">Add Medication</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/history')}>
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Log Symptoms</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/clinics')}>
              <AlertCircle className="h-6 w-6" />
              <span className="text-sm">Find Clinic</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/analytics')}>
              <Activity className="h-6 w-6" />
              <span className="text-sm">View Trends</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

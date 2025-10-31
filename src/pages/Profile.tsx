"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Shield,
  Activity,
  Plus,
  Trash,
} from "lucide-react"

// Firestore
import { db } from "../firebase-config"
import { doc, setDoc, getDoc } from "firebase/firestore"

const Profile = () => {
  const STORAGE_KEY = "personal_details"
  const PROFILE_DOC = doc(db, "users", "demoUser")
  const MEDICAL_DOC = doc(db, "users/demoUser/medicalHistory", "default")

  // Personal
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNum, setPhoneNum] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")

  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<
    { name: string; relationship: string; phone: string }[]
  >([])

  // Analytics-related
  const [familyHistory, setFamilyHistory] = useState<
    { relation: string; condition: string; risk: number }[]
  >([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [timelinePredictions, setTimelinePredictions] = useState<
    { age: number; condition: string; risk: string }[]
  >([])
  const [lifestyle, setLifestyle] = useState<string[]>([])
  const [preventiveCare, setPreventiveCare] = useState<string[]>([])
  const [whatIfScenarios, setWhatIfScenarios] = useState<{ [key: string]: string }>({})

  const initials = useMemo(
    () =>
      `${(firstName || " ").charAt(0)}${(lastName || " ").charAt(0)}`.toUpperCase(),
    [firstName, lastName]
  )

  const computeAge = (dateStr?: string) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ""
    const diff = Date.now() - d.getTime()
    const ageDate = new Date(diff)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  // Fetch Firestore data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const pSnap = await getDoc(PROFILE_DOC)
        if (pSnap.exists()) {
          const data = pSnap.data()
          setFirstName(data.firstName || "")
          setLastName(data.lastName || "")
          setEmail(data.email || "")
          setPhoneNum(data.phone || "")
          setBirthDate(data.birthDate || "")
          setGender(data.gender || "")
          setAddress(data.address || "")
          setEmergencyContacts(data.emergencyContacts || [])
        }

        const mSnap = await getDoc(MEDICAL_DOC)
        if (mSnap.exists()) {
          const data = mSnap.data()
          setFamilyHistory(data.familyHistory || [])
          setAllergies(data.allergies || [])
          setTimelinePredictions(data.timelinePredictions || [])
          setLifestyle(data.lifestyle || [])
          setPreventiveCare(data.preventiveCare || [])
          setWhatIfScenarios(data.whatIfScenarios || {})
        }
      } catch (err) {
        console.error("Error loading Firestore data:", err)
      }
    }
    loadData()
  }, [])

  const handleSave = async () => {
    const name = `${firstName}`.trim() + (lastName.trim() ? ` ${lastName.trim()}` : "")
    const age = computeAge(birthDate) as number | ""

    const personalPayload = {
      name,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age,
      gender,
      email,
      phone: phoneNum,
      birthDate,
      address,
      emergencyContacts,
    }

    const medicalPayload = {
      familyHistory,
      allergies,
      timelinePredictions,
      lifestyle,
      preventiveCare,
      whatIfScenarios,
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(personalPayload))
      await setDoc(PROFILE_DOC, personalPayload, { merge: true })
      await setDoc(MEDICAL_DOC, medicalPayload, { merge: true })
      alert("Profile, Emergency & Medical History saved ✅")
    } catch (err) {
      console.error("Error saving:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" /> Emergency Contacts
          </CardTitle>
          <CardDescription>People to contact in case of emergency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((c, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <Input
                placeholder="Name"
                value={c.name}
                onChange={(e) => {
                  const copy = [...emergencyContacts]
                  copy[i].name = e.target.value
                  setEmergencyContacts(copy)
                }}
              />
              <Input
                placeholder="Relationship"
                value={c.relationship}
                onChange={(e) => {
                  const copy = [...emergencyContacts]
                  copy[i].relationship = e.target.value
                  setEmergencyContacts(copy)
                }}
              />
              <Input
                placeholder="Phone"
                value={c.phone}
                onChange={(e) => {
                  const copy = [...emergencyContacts]
                  copy[i].phone = e.target.value
                  setEmergencyContacts(copy)
                }}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() =>
                  setEmergencyContacts(emergencyContacts.filter((_, idx) => idx !== i))
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmergencyContacts([...emergencyContacts, { name: "", relationship: "", phone: "" }])}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Medical History / Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Medical History (Analytics)
          </CardTitle>
          <CardDescription>
            Enter family history, allergies, lifestyle & risk predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Family History */}
          <div>
            <h3 className="font-medium mb-2">Family History</h3>
            {familyHistory.map((f, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <Input
                  placeholder="Relation"
                  value={f.relation}
                  onChange={(e) => {
                    const copy = [...familyHistory]
                    copy[i].relation = e.target.value
                    setFamilyHistory(copy)
                  }}
                />
                <Input
                  placeholder="Condition"
                  value={f.condition}
                  onChange={(e) => {
                    const copy = [...familyHistory]
                    copy[i].condition = e.target.value
                    setFamilyHistory(copy)
                  }}
                />
                <Input
                  type="number"
                  placeholder="Risk %"
                  value={f.risk}
                  onChange={(e) => {
                    const copy = [...familyHistory]
                    copy[i].risk = Number(e.target.value)
                    setFamilyHistory(copy)
                  }}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setFamilyHistory(familyHistory.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFamilyHistory([...familyHistory, { relation: "", condition: "", risk: 0 }])
              }
            >
              <Plus className="h-4 w-4 mr-2" /> Add Family History
            </Button>
          </div>

          {/* Allergies */}
          <div>
            <h3 className="font-medium mb-2">Allergies</h3>
            {allergies.map((a, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <Input
                  placeholder="Allergy"
                  value={a}
                  onChange={(e) => {
                    const copy = [...allergies]
                    copy[i] = e.target.value
                    setAllergies(copy)
                  }}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllergies([...allergies, ""])}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Allergy
            </Button>
          </div>

          {/* Lifestyle / Preventive / Timeline / What-If can be added similarly */}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save All
        </Button>
      </div>
    </div>
  )
}

export default Profile
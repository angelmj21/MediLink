import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Activity, Heart, Pill, Calendar, Download, AlertTriangle, Users } from "lucide-react"
import { db } from "../firebase-Config"
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore"

// 🔹 Added Recharts for Risk/Comparison Charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const Analytics = () => {
  const PROFILE_DOC = doc(db, "users", "demoUser")
  type Medication = { name: string; dosage: string; reminders: boolean; status: string }
  const [medications, setMedications] = useState<Medication[]>([])
  const [activities, setActivities] = useState<{ date: string; type: string; provider?: string; notes?: string; description?: string }[]>([])

  // ---------------------------
  // EXISTING FIRESTORE SYNC CODE
  // ---------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const snap = await getDoc(PROFILE_DOC)
        if (snap.exists()) {
          const data = snap.data() as any
          if (Array.isArray(data?.medications)) setMedications(data.medications as Medication[])
          if (Array.isArray(data?.activities)) setActivities(data.activities as any)
        }
      } catch {}
    }
    void init()
    const unsub = onSnapshot(PROFILE_DOC, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any
        if (Array.isArray(data?.medications)) setMedications(data.medications as Medication[])
        if (Array.isArray(data?.activities)) setActivities(data.activities as any)
      }
    })
    return () => unsub()
  }, [])

  // ---------------------------
  // HARD-CODED DEMO DATA FOR FAMILY HISTORY
  // ---------------------------
  const familyHistory = [
    { relation: "Father", condition: "Diabetes", risk: 45 },
    { relation: "Mother", condition: "Hypertension", risk: 60 },
    { relation: "Grandfather", condition: "Asthma", risk: 35 },
  ]

  const allergies = ["Penicillin", "Peanuts", "Dust/Pollen"]

  const allergyWarnings: Record<string, string[]> = {
    Penicillin: ["Amoxicillin", "Ampicillin"],
    Peanuts: ["Peanut oil–based medicines"],
    "Dust/Pollen": ["Certain inhalers may trigger reactions"],
  }

  const chronicRiskMapping: Record<string, string> = {
    Diabetes: "Higher risk of Type 2 Diabetes",
    Hypertension: "Increased risk of heart disease",
    Asthma: "Possible respiratory issues",
  }

  const preventiveReminders = [
    "Annual blood sugar test",
    "Blood pressure monitoring every 6 months",
    "Yearly flu vaccine",
    "Lung function test every 2 years",
  ]

  const populationComparison = [
    { condition: "Diabetes", you: 45, population: 25 },
    { condition: "Hypertension", you: 60, population: 40 },
    { condition: "Asthma", you: 35, population: 20 },
  ]

  const whatIfScenarios = [
    { scenario: "If you smoke", risk: "+20%" },
    { scenario: "If sedentary lifestyle", risk: "+15%" },
    { scenario: "If regular exercise", risk: "-10%" },
  ]

  // ---------------------------
  // EXISTING COMPUTED METRICS
  // ---------------------------
  const computedMetrics = useMemo(() => {
    const totalMeds = medications.length
    const active = medications.filter((m: any) => (m.status || '').toLowerCase() === 'active').length
    const low = medications.filter((m: any) => typeof m.remaining === 'number' && m.remaining <= 10).length
    const adherenceAvg = Math.round(
      (medications.reduce((acc: number, m: any) => acc + (m.reminders ? 95 : 85), 0) / (totalMeds || 1))
    )
    return [
      { name: 'Avg Adherence', value: `${adherenceAvg}%`, change: '', trend: 'up', description: 'estimate' },
      { name: 'Total Meds', value: String(totalMeds), change: '', trend: 'up', description: 'current' },
      { name: 'Active', value: String(active), change: '', trend: 'up', description: 'prescriptions' },
      { name: 'Low Stock', value: String(low), change: '', trend: low > 0 ? 'down' : 'up', description: 'need refill' },
    ]
  }, [medications])

  // ---------------------------
  // EXISTING BMI + FUNCTIONS
  // ---------------------------
  const [heightCm, setHeightCm] = useState<string>("")
  const [weightKg, setWeightKg] = useState<string>("")
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCat, setBmiCat] = useState<string>("")

  const computeBmi = (wKg: number, hCm: number) => {
    if (!wKg || !hCm) return null
    const hM = hCm / 100
    return parseFloat((wKg / (hM * hM)).toFixed(1))
  }

  const categoryFor = (v: number | null) => {
    if (v == null) return ""
    if (v < 18.5) return "Underweight"
    if (v < 25) return "Normal"
    if (v < 30) return "Overweight"
    return "Obese"
  }

  useEffect(() => {
    const h = parseFloat(heightCm)
    const w = parseFloat(weightKg)
    const val = computeBmi(w, h)
    setBmi(val)
    setBmiCat(categoryFor(val))
  }, [heightCm, weightKg])

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="space-y-6">
      {/* HEADER OMITTED FOR BREVITY */}

      {/* ...existing BMI, metrics, charts, appointments... */}

      {/* 🔹 NEW FAMILY HISTORY & RISK ANALYSIS SECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Family History & Risk Analysis
          </CardTitle>
          <CardDescription>
            Genetic predispositions, allergy risks, and lifestyle-based predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Risk Meters */}
          <div>
            <h3 className="font-medium mb-2">Risk Percentages</h3>
            <ul className="space-y-3">
              {familyHistory.map((f, i) => (
                <li key={i} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{f.relation}: {f.condition}</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${f.risk}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{f.risk}% risk — {chronicRiskMapping[f.condition]}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline Predictions */}
          <div>
            <h3 className="font-medium mb-2">Timeline Predictions</h3>
            <p className="text-sm text-muted-foreground">By age 40, higher risk of Hypertension.</p>
            <p className="text-sm text-muted-foreground">By age 50, moderate risk of Diabetes complications.</p>
          </div>

          {/* Lifestyle Recommendations */}
          <div>
            <h3 className="font-medium mb-2">Lifestyle Recommendations</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Regular exercise (30 min/day)</li>
              <li>Balanced diet low in sodium</li>
              <li>Quarterly health checkups</li>
            </ul>
          </div>

          {/* Medication Alerts */}
          <div>
            <h3 className="font-medium mb-2">Medication Alerts</h3>
            {allergies.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-700">{a}</span>
                <span className="text-sm text-red-600">→ Avoid: {allergyWarnings[a]?.join(", ")}</span>
              </div>
            ))}
          </div>

          {/* Preventive Reminders */}
          <div>
            <h3 className="font-medium mb-2">Preventive Care Reminders</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {preventiveReminders.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Comparison Chart */}
          <div>
            <h3 className="font-medium mb-2">Your Risk vs Population</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={populationComparison}>
                <XAxis dataKey="condition" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="you" fill="#2563eb" name="You" />
                <Bar dataKey="population" fill="#9ca3af" name="Population Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* What-if Simulation */}
          <div>
            <h3 className="font-medium mb-2">What-if Simulation</h3>
            <ul className="space-y-2">
              {whatIfScenarios.map((s, i) => (
                <li key={i} className="p-2 bg-muted/50 rounded-lg flex justify-between">
                  <span>{s.scenario}</span>
                  <Badge variant="outline">{s.risk}</Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* Family Tree View */}
          <div>
            <h3 className="font-medium mb-2">Family Tree View</h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">👴 Grandfather → Asthma</p>
              <p className="text-sm">👨 Father → Diabetes</p>
              <p className="text-sm">👩 Mother → Hypertension</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EXISTING OVERALL HEALTH SCORE CARD BELOW */}
    </div>
  )
}

export default Analytics
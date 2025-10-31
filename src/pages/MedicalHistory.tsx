import { useEffect, useState } from "react"
import { db } from "../firebase-Config"
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, AlertTriangle, Upload, Calendar, Trash2, Image } from "lucide-react"

const MedicalHistory = () => {
  const [selectedTab, setSelectedTab] = useState("conditions")
  const [open, setOpen] = useState(false)

  const STORAGE_KEY = "medical_history_state"
  const PROFILE_DOC = doc(db, "users", "demoUser")

  const defaultConditions = [
    { name: "Hypertension", diagnosed: "2020-03-15", status: "Active", severity: "Moderate" },
    { name: "Type 2 Diabetes", diagnosed: "2019-08-22", status: "Active", severity: "Mild" },
    { name: "Seasonal Allergies", diagnosed: "2018-04-10", status: "Active", severity: "Mild" },
  ]
  const defaultAllergies = [
    { allergen: "Penicillin", reaction: "Skin rash", severity: "Moderate" },
    { allergen: "Peanuts", reaction: "Breathing difficulty", severity: "Severe" },
    { allergen: "Shellfish", reaction: "Swelling", severity: "Moderate" },
  ]
  const defaultPrescriptions = [
    { medication: "Lisinopril", dosage: "10mg daily", prescribed: "2023-01-15", prescriber: "Dr. Smith" },
    { medication: "Metformin", dosage: "500mg twice daily", prescribed: "2023-02-20", prescriber: "Dr. Johnson" },
    { medication: "Vitamin D3", dosage: "1000 IU daily", prescribed: "2023-03-10", prescriber: "Dr. Smith" },
  ]
  const defaultDocuments = [
    { name: "Blood Test Results", date: "2024-01-15", type: "Lab Report", imageData: null },
    { name: "X-Ray Chest", date: "2023-12-20", type: "Imaging", imageData: null },
    { name: "Vaccination Record", date: "2023-11-05", type: "Immunization", imageData: null },
  ]

  const loadStored = () => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  // Data state (initialized with existing seed data)
  const stored = loadStored()
  const [conditions, setConditions] = useState(stored?.conditions ?? defaultConditions)
  const [allergies, setAllergies] = useState(stored?.allergies ?? defaultAllergies)
  const [prescriptions, setPrescriptions] = useState(stored?.prescriptions ?? defaultPrescriptions)
  const [documents, setDocuments] = useState(stored?.documents ?? defaultDocuments)

  useEffect(() => {
    try {
      const payload = { conditions, allergies, prescriptions, documents }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore storage errors
    }
    try {
      void setDoc(PROFILE_DOC, { conditions, allergies, prescriptions, documents }, { merge: true })
    } catch {}
  }, [conditions, allergies, prescriptions, documents])

  // Load from Firestore and subscribe to changes
  useEffect(() => {
    let unsub: undefined | (() => void)
    const init = async () => {
      try {
        const snap = await getDoc(PROFILE_DOC)
        if (snap.exists()) {
          const data = snap.data() as any
          if (Array.isArray(data?.conditions)) setConditions(data.conditions)
          if (Array.isArray(data?.allergies)) setAllergies(data.allergies)
          if (Array.isArray(data?.prescriptions)) setPrescriptions(data.prescriptions)
          if (Array.isArray(data?.documents)) setDocuments(data.documents)
        }
      } catch {}
      unsub = onSnapshot(PROFILE_DOC, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any
          if (Array.isArray(data?.conditions)) setConditions(data.conditions)
          if (Array.isArray(data?.allergies)) setAllergies(data.allergies)
          if (Array.isArray(data?.prescriptions)) setPrescriptions(data.prescriptions)
          if (Array.isArray(data?.documents)) setDocuments(data.documents)
        }
      })
    }
    void init()
    return () => { if (unsub) unsub() }
  }, [])

  // Form state
  const [recordType, setRecordType] = useState("Medical Condition")
  const [recordName, setRecordName] = useState("")
  const [recordDetails, setRecordDetails] = useState("")

  const resetForm = () => {
    setRecordType("Medical Condition")
    setRecordName("")
    setRecordDetails("")
  }

  const handleAddRecord = () => {
    const todayIso = new Date().toISOString()
    if (!recordName.trim()) return

    switch (recordType) {
      case "Medical Condition": {
        setConditions(prev => [
          { name: recordName.trim(), diagnosed: todayIso, status: "Active", severity: "Mild" },
          ...prev,
        ])
        setSelectedTab("conditions")
        break
      }
      case "Allergy": {
        setAllergies(prev => [
          { allergen: recordName.trim(), reaction: recordDetails.trim() || "Unknown", severity: "Moderate" },
          ...prev,
        ])
        setSelectedTab("allergies")
        break
      }
      case "Prescription": {
        setPrescriptions(prev => [
          { medication: recordName.trim(), dosage: recordDetails.trim() || "As directed", prescribed: todayIso, prescriber: "Self" },
          ...prev,
        ])
        setSelectedTab("prescriptions")
        break
      }
      case "Document": {
        setDocuments(prev => [
          { name: recordName.trim(), date: todayIso, type: recordDetails.trim() || "General", imageData: null },
          ...prev,
        ])
        setSelectedTab("documents")
        break
      }
      default:
        break
    }

    resetForm()
    setOpen(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe": return "destructive"
      case "moderate": return "secondary"
      case "mild": return "outline"
      default: return "outline"
    }
  }

  // File upload functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      const todayIso = new Date().toISOString()
      
      // Add new document with image
      setDocuments(prev => [
        { 
          name: file.name, 
          date: todayIso, 
          type: "Uploaded Image", 
          imageData: imageData 
        },
        ...prev,
      ])
      setSelectedTab("documents")
    }
    reader.readAsDataURL(file)
  }

  // Delete functions
  const deleteCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  const deleteAllergy = (index: number) => {
    setAllergies(prev => prev.filter((_, i) => i !== index))
  }

  const deletePrescription = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index))
  }

  const deleteDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical History</h1>
          <p className="text-muted-foreground">Manage your health records and medical information</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
              <DialogDescription>Add a new condition, allergy, or prescription to your medical history.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recordType">Record Type</Label>
                <select id="recordType" className="w-full mt-1 p-2 border rounded-md" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
                  <option value="Medical Condition">Medical Condition</option>
                  <option value="Allergy">Allergy</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Document">Document</option>
                </select>
              </div>
              <div>
                <Label htmlFor="recordName">Name/Description</Label>
                <Input id="recordName" placeholder="Enter name or description" value={recordName} onChange={(e) => setRecordName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="recordDetails">Additional Details</Label>
                <Textarea id="recordDetails" placeholder={recordType === "Allergy" ? "Reaction (e.g., rash)" : recordType === "Prescription" ? "Dosage (e.g., 10mg daily)" : recordType === "Document" ? "Type (e.g., Lab Report)" : "Optional notes"} value={recordDetails} onChange={(e) => setRecordDetails(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleAddRecord}>Add Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Conditions
              </CardTitle>
              <CardDescription>Your diagnosed medical conditions and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-medium">{condition.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Diagnosed: {new Date(condition.diagnosed).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(condition.severity)}>{condition.severity}</Badge>
                      <Badge variant="outline">{condition.status}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCondition(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allergies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Allergies & Reactions
              </CardTitle>
              <CardDescription>Known allergies and their reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-medium">{allergy.allergen}</h3>
                      <p className="text-sm text-muted-foreground">Reaction: {allergy.reaction}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAllergy(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prescriptions
              </CardTitle>
              <CardDescription>Current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-medium">{prescription.medication}</h3>
                      <p className="text-sm text-muted-foreground">Dosage: {prescription.dosage}</p>
                      <p className="text-sm text-muted-foreground">Prescribed by: {prescription.prescriber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Prescribed</p>
                        <p className="text-sm font-medium">{new Date(prescription.prescribed).toLocaleDateString()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePrescription(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Medical Documents
              </CardTitle>
              <CardDescription>Uploaded medical reports, test results, and images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload medical images and documents</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Image Files
                    </label>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{doc.name}</h3>
                          {doc.imageData && <Image className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">Type: {doc.type}</p>
                        {doc.imageData && (
                          <div className="mt-2">
                            <img 
                              src={doc.imageData} 
                              alt={doc.name}
                              className="max-w-xs max-h-32 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Uploaded</p>
                          <p className="text-sm font-medium">{new Date(doc.date).toLocaleDateString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDocument(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MedicalHistory
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, AlertTriangle, Upload, Calendar } from "lucide-react"

const MedicalHistory = () => {
  const [selectedTab, setSelectedTab] = useState("conditions")

  const conditions = [
    { name: "Hypertension", diagnosed: "2020-03-15", status: "Active", severity: "Moderate" },
    { name: "Type 2 Diabetes", diagnosed: "2019-08-22", status: "Active", severity: "Mild" },
    { name: "Seasonal Allergies", diagnosed: "2018-04-10", status: "Active", severity: "Mild" },
  ]

  const allergies = [
    { allergen: "Penicillin", reaction: "Skin rash", severity: "Moderate" },
    { allergen: "Peanuts", reaction: "Breathing difficulty", severity: "Severe" },
    { allergen: "Shellfish", reaction: "Swelling", severity: "Moderate" },
  ]

  const prescriptions = [
    { medication: "Lisinopril", dosage: "10mg daily", prescribed: "2023-01-15", prescriber: "Dr. Smith" },
    { medication: "Metformin", dosage: "500mg twice daily", prescribed: "2023-02-20", prescriber: "Dr. Johnson" },
    { medication: "Vitamin D3", dosage: "1000 IU daily", prescribed: "2023-03-10", prescriber: "Dr. Smith" },
  ]

  const documents = [
    { name: "Blood Test Results", date: "2024-01-15", type: "Lab Report" },
    { name: "X-Ray Chest", date: "2023-12-20", type: "Imaging" },
    { name: "Vaccination Record", date: "2023-11-05", type: "Immunization" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe": return "destructive"
      case "moderate": return "secondary"
      case "mild": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical History</h1>
          <p className="text-muted-foreground">Manage your health records and medical information</p>
        </div>
        <Dialog>
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
                <select id="recordType" className="w-full mt-1 p-2 border rounded-md">
                  <option>Medical Condition</option>
                  <option>Allergy</option>
                  <option>Prescription</option>
                  <option>Document</option>
                </select>
              </div>
              <div>
                <Label htmlFor="recordName">Name/Description</Label>
                <Input id="recordName" placeholder="Enter name or description" />
              </div>
              <div>
                <Label htmlFor="recordDetails">Additional Details</Label>
                <Textarea id="recordDetails" placeholder="Enter any additional details..." />
              </div>
              <Button className="w-full">Add Record</Button>
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
                    <Badge variant={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
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
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Prescribed</p>
                      <p className="text-sm font-medium">{new Date(prescription.prescribed).toLocaleDateString()}</p>
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
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <Button variant="outline" size="sm">Choose Files</Button>
                </div>
                
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="space-y-1">
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">Type: {doc.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Uploaded</p>
                        <p className="text-sm font-medium">{new Date(doc.date).toLocaleDateString()}</p>
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
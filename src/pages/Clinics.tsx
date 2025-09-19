import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Star, Heart, Eye, Brain, Navigation } from "lucide-react"

const Clinics = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")

  const clinics = [
    {
      id: 1,
      name: "Central Medical Center",
      specialty: "General Practice",
      address: "123 Main Street, Downtown",
      distance: "0.5 miles",
      rating: 4.8,
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 8AM-6PM",
      icon: Heart,
      emergency: true,
      favorite: true
    },
    {
      id: 2,
      name: "Cardiology Specialists",
      specialty: "Cardiology",
      address: "456 Health Avenue, Medical District",
      distance: "1.2 miles",
      rating: 4.9,
      phone: "(555) 234-5678",
      hours: "Mon-Fri: 7AM-5PM",
      icon: Heart,
      emergency: false,
      favorite: false
    },
    {
      id: 3,
      name: "Vision Care Center",
      specialty: "Ophthalmology",
      address: "789 Eye Street, Vision Plaza",
      distance: "2.1 miles",
      rating: 4.7,
      phone: "(555) 345-6789",
      hours: "Mon-Sat: 9AM-7PM",
      icon: Eye,
      emergency: false,
      favorite: true
    },
    {
      id: 4,
      name: "Mental Health Clinic",
      specialty: "Psychiatry",
      address: "321 Wellness Drive, Health Park",
      distance: "1.8 miles",
      rating: 4.6,
      phone: "(555) 456-7890",
      hours: "Mon-Fri: 8AM-8PM",
      icon: Brain,
      emergency: false,
      favorite: false
    },
    {
      id: 5,
      name: "Emergency Medical Center",
      specialty: "Emergency Medicine",
      address: "999 Emergency Blvd, Hospital District",
      distance: "0.8 miles",
      rating: 4.5,
      phone: "(555) 911-0000",
      hours: "24/7",
      icon: Heart,
      emergency: true,
      favorite: false
    }
  ]

  const specialties = [
    { value: "all", label: "All Specialties" },
    { value: "general", label: "General Practice" },
    { value: "cardiology", label: "Cardiology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "emergency", label: "Emergency Medicine" },
  ]

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialty = selectedSpecialty === "all" || 
                            clinic.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Find Clinics</h1>
          <p className="text-muted-foreground">Locate nearby healthcare providers and book appointments</p>
        </div>
        <Button className="gap-2">
          <Navigation className="h-4 w-4" />
          Get Directions
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by clinic name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-64">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Nearby Clinics
          </CardTitle>
          <CardDescription>Interactive map showing clinic locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
              <p className="text-sm text-muted-foreground">Showing {filteredClinics.length} clinics near you</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinic List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClinics.map((clinic) => (
          <Card key={clinic.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <clinic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{clinic.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{clinic.specialty}</Badge>
                      {clinic.emergency && <Badge variant="destructive">Emergency</Badge>}
                      {clinic.favorite && <Badge variant="outline">⭐ Favorite</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{clinic.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{clinic.address}</span>
                  <span className="text-primary font-medium">• {clinic.distance}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{clinic.hours}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">Book Appointment</Button>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClinics.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No clinics found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or location.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Clinics
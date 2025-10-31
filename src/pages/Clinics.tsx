import React, { useEffect, useState } from "react"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"

interface Clinic {
  id: number
  lat: number
  lng: number
  name: string
  specialty?: string
  distance?: string
  rating?: number
  emergency?: boolean
}

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
}

const Clinics = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBDY1DjkL2vKsOrpSVWioLCw94aQdj22j4",
    libraries: ["places"],
  })

  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([])
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Get user location
  useEffect(() => {
    const fetchIpLocation = () => {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          setUserPosition({ lat: data.latitude, lng: data.longitude })
        })
    }

    if (!navigator.geolocation) {
      fetchIpLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => fetchIpLocation(),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  // Fetch nearby clinics
  useEffect(() => {
    if (!userPosition) return
    const { lat, lng } = userPosition
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="clinic"](around:5000,${lat},${lng});
        node["amenity"="hospital"](around:5000,${lat},${lng});
      );
      out;
    `
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.elements) return
        const clinicsData: Clinic[] = data.elements.map((el: any, i: number) => ({
          id: el.id || i,
          lat: el.lat,
          lng: el.lon,
          name: el.tags?.name || "Unnamed Clinic",
          specialty: el.tags?.specialty || "General Practice",
          rating: +(Math.random() * 2 + 3).toFixed(1),
          distance: `${(Math.random() * 5 + 0.2).toFixed(1)} km`,
          emergency: Math.random() > 0.7,
        }))
        setClinics(clinicsData.slice(0, 10))
        setFilteredClinics(clinicsData.slice(0, 10))
      })
      .catch((e) => console.error("Failed to fetch clinics:", e))
  }, [userPosition])

  // Filter clinics by search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredClinics(clinics)
    } else {
      setFilteredClinics(
        clinics.filter((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery, clinics])

  if (!isLoaded || !userPosition) return <p>Loading map and location...</p>

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search clinics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Nearby Clinics
          </CardTitle>
          <CardDescription>Showing your location and nearby clinics</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleMap mapContainerStyle={containerStyle} center={userPosition} zoom={14}>
            {/* User marker */}
            <Marker
              position={userPosition}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
              onClick={() => setShowUserInfo(true)}
            />
            {showUserInfo && (
              <InfoWindow position={userPosition} onCloseClick={() => setShowUserInfo(false)}>
                <div>You are here</div>
              </InfoWindow>
            )}

            {/* Filtered clinic markers */}
            {filteredClinics.map((clinic) => (
              <Marker
                key={clinic.id}
                position={{ lat: clinic.lat, lng: clinic.lng }}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                onClick={() => setSelectedClinic(clinic)}
              />
            ))}

            {selectedClinic && (
              <InfoWindow
                position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
                onCloseClick={() => setSelectedClinic(null)}
              >
                <div>
                  <h3>{selectedClinic.name}</h3>
                  {selectedClinic.specialty && <p>{selectedClinic.specialty}</p>}
                  {/* Get Directions button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${selectedClinic.lat},${selectedClinic.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </CardContent>
      </Card>

      {/* Clinic list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClinics.map((clinic) => (
          <Card key={clinic.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{clinic.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {clinic.specialty && <Badge variant="secondary">{clinic.specialty}</Badge>}
                    {clinic.emergency && <Badge variant="destructive">Emergency</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{clinic.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <MapPin className="inline h-4 w-4 mr-1" /> {clinic.distance}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Clinics
import React from "react"
import "./LandingPage.css"
import { auth } from "../firebase-Config"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()
  const provider = new GoogleAuthProvider()

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate("/dashboard") // redirect to dashboard after login
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="landing">
      <section className="flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-bold text-[hsl(var(--primary))]">
          Welcome MediLink!!!!!!
        </h1>
        <p className="mt-4 text-lg text-[hsl(var(--foreground))] max-w-xl text-center">
          Track your health, manage prescriptions, and find nearby clinics all in one place.
        </p>
        <div className="mt-6 flex space-x-4">
          {/* ✅ Firebase Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition"
          >
            Sign in with Google
          </button>

          {/* ✅ Demo/Explore without login */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-lg border border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] transition"
          >
            Explore Demo
          </button>
        </div>
      </section>
    </div>
  )
}

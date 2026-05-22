"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault()

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {

      localStorage.setItem("token", data.token)

      router.push("/dashboard/projects")

    } else {

      alert(data.error)

    }

  }

  return (

    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleLogin}
        className="w-96 p-6 shadow-lg rounded-lg"
      >

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  )
}
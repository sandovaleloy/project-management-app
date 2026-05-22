"use client"

import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (

    <div>

      <div className="flex justify-between items-center p-6 border-b">

        <h1 className="text-xl font-bold">
          Task Manager
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>

      </div>

      {children}

    </div>

  )
}
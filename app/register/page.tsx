"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

export default function RegisterPage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    setLoading(true)

    try {

      const res = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {

        toast.error(data.error)

        setLoading(false)

        return

      }

      toast.success("Usuario creado correctamente")

      router.push("/login")

    } catch (error) {

      console.error(error)

      alert("Error del servidor")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="
          w-96
          p-6
          bg-black
          rounded-lg
          shadow-lg
        "
      >

        <h1 className="text-2xl font-bold mb-6">
          Crear Cuenta
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            w-full
            p-2
            border
            mb-3
            rounded
          "
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            p-2
            border
            mb-3
            rounded
          "
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            p-2
            border
            mb-4
            rounded
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-black
            text-white
            p-2
            rounded
            hover:bg-gray-800
            disabled:opacity-50
          "
        >
          {loading
            ? "Creando..."
            : "Crear cuenta"}
        </button>

        <p className="text-center mt-4 text-sm">

          ¿Ya tienes cuenta?{" "}

          <Link
            href="/login"
            className="
              text-blue-600
              hover:underline
            "
          >
            Inicia sesión
          </Link>

        </p>

      </form>

    </div>

  )

}
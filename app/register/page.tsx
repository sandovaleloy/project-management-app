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

      toast.error("Ocurrió un error inesperado")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >
      <form
        onSubmit={handleRegister}
        autoComplete="off"
        className="
          w-full
          max-w-md

          bg-violet-100

          border
          border-slate-200

          rounded-3xl

          shadow-xl

          p-8
        "
      >

        <div className="text-center mb-8">

          <h1
            className="
              text-4xl
              font-extrabold
              text-blue-600
              tracking-tight
            "
          >
            Crear Cuenta
          </h1>

         <p
            className="
              text-center
              mt-6

              text-sm

              text-slate-500
            "
          >
            Comienza a gestionar tus proyectos
          </p>

        </div>

        <input
          type="text"
          placeholder="Nombre"
          autoComplete="name" 
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            w-full

            p-3
            placeholder:text-slate-400

            border
            border-slate-300

            rounded-xl

            bg-white

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100

            transition
          "
        />

        <input
          type="email"
          placeholder="Correo"
          autoComplete="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full

            p-3
            placeholder:text-slate-400
            border
            border-slate-300

            rounded-xl

            bg-white

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100

            transition
          "
        />

        <input
          type="password"
          placeholder="Contraseña"
          autoComplete="new-password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full

            p-3
            placeholder:text-slate-400  
            border
            border-slate-300

            rounded-xl

            bg-white

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100

            transition
            mb-2
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full

            bg-blue-600
            hover:bg-blue-700

            text-white

            font-medium

            py-3

            rounded-xl

            shadow-lg

            transition-all

            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Creando..."
            : "Crear cuenta"}
        </button>

        <p className="text-center mt-4 text-sm text-slate-500">

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
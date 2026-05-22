import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {

  try {

    const { name, email, password } = await req.json()

    // validar datos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      )
    }

    // verificar si el usuario ya existe
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      )
    }

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({
      message: "Usuario creado",
      user
    })

  } catch (error) {

    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )

  }

} 
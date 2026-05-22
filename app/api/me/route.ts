import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })

  } catch (error) {

    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    )

  }
}
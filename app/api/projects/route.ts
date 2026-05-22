import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {

  try {

    const authHeader =
      req.headers.get("authorization") ||
      req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    const decoded: any = verifyToken(token)

    const body = await req.json()

    const project = await prisma.project.create({
      data: {
        name: body.name,
        userId: decoded.userId
      }
    })

    return NextResponse.json(project)

  } catch (error) {

    console.log("ERROR CREANDO PROYECTO:", error)

    return NextResponse.json(
      { error: "Error creando proyecto" },
      { status: 500 }
    )

  }

}


export async function GET(req: Request) {

  try {

    const authHeader =
      req.headers.get("authorization") ||
      req.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyToken(token)

    const projects = await prisma.project.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(projects)

  } catch (error) {

    console.error("ERROR OBTENIENDO PROYECTOS:", error)

    return NextResponse.json(
      { error: "Error obteniendo proyectos" },
      { status: 500 }
    )

  }

}
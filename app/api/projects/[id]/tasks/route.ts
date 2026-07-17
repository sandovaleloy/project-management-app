import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { verifyToken } from "@/lib/auth"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

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

    const decoded = verifyToken(token)

    const body = await req.json()

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: decoded.userId
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    const task = await prisma.task.create({
  data: {
    title: body.title,
    status: body.status as TaskStatus,
    priority: body.priority as TaskPriority,
    project: {
      connect: {
        id
      }
    }
  }
})

    return NextResponse.json(task)

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Error creando tarea" },
      { status: 500 }
    )

  }

}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

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

    const decoded = verifyToken(token)

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: decoded.userId
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(tasks)

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Error obteniendo tareas" },
      { status: 500 }
    )

  }

}
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    const body = await req.json()

    if (!body.title || !body.projectId) {
      return NextResponse.json(
        { error: "title y projectId son requeridos" },
        { status: 400 }
      )
    }

    // 🔎 Verificar que el proyecto pertenezca al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: body.projectId,
        userId: decoded.userId
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado o no autorizado" },
        { status: 403 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        projectId: body.projectId
      }
    })

    return NextResponse.json(task)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creando tarea" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET!)

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "projectId requerido" }, { status: 400 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(tasks)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error obteniendo tareas" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET!)

    const body = await req.json()

    if (!body.taskId) {
      return NextResponse.json({ error: "taskId requerido" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: {
        id: body.taskId
      },
      data: {
        completed: body.completed
      }
    })

    return NextResponse.json(task)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error actualizando tarea" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET!)

    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId requerido" }, { status: 400 })
    }

    await prisma.task.delete({
      where: {
        id: taskId
      }
    })

    return NextResponse.json({ message: "Tarea eliminada" })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error eliminando tarea" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

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

    const task = await prisma.task.updateMany({
      where: {
        id: id,
        project: {
          userId: decoded.userId
        }
      },
      data: {
        status: body.status
      }
    })

    if (task.count === 0) {

      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      )

    }

    return NextResponse.json({
      message: "Estado actualizado"
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Error actualizando tarea" },
      { status: 500 }
    )

  }

}

export async function DELETE(
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

    const task = await prisma.task.deleteMany({
      where: {
        id,
        project: {
          userId: decoded.userId
        }
      }
    })

    if (task.count === 0) {
      return NextResponse.json(
        { error: "Tarea no encontrada o no autorizada" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Tarea eliminada"
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Error eliminando tarea" },
      { status: 500 }
    )

  }

}
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

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
        { error: "Token requerido" },
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
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    await prisma.task.deleteMany({
  where: {
    projectId: id
  }
})

await prisma.project.delete({
  where: {
    id
  }
})

    return NextResponse.json({
      message: "Proyecto eliminado"
    })

  } catch (error) {

    console.error("DELETE PROJECT ERROR:", error)

    return NextResponse.json(
      { error: "Error eliminando proyecto" },
      { status: 500 }
    )

  }

}
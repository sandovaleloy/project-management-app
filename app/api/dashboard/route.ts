import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  try {

    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    )

    const userId = decoded.userId

    const projects = await prisma.project.count({
      where: { userId }
    })

    const userProjects = await prisma.project.findMany({
      where: { userId },
      select: { id: true }
    })

    const projectIds = userProjects.map(p => p.id)

    if (projectIds.length === 0) {
      return NextResponse.json({
        projects: 0,
        tasks: 0,
        completedTasks: 0,
        pendingTasks: 0
      })
    }

    const tasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds }
      }
    })

    const completedTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds },
        completed: true
      }
    })

    const pendingTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds },
        completed: false
      }
    })

    return NextResponse.json({
      projects,
      tasks,
      completedTasks,
      pendingTasks
    })

  } catch (error: any) {

    console.error("ERROR DASHBOARD:", error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )

  }
}
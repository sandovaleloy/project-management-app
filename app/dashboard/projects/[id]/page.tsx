"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ProjectTasksPage() {

  const params = useParams()
  const id = params.id as string

  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState("")

  const fetchTasks = async () => {

    const token = localStorage.getItem("token")

    const res = await fetch(`/api/projects/${id}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (Array.isArray(data)) {
      setTasks(data)
    } else {
      console.error("Error API:", data)
      setTasks([])
    }
  }

  useEffect(() => {
    if (id) fetchTasks()
  }, [id])

  const createTask = async () => {

    const token = localStorage.getItem("token")

    await fetch(`/api/projects/${id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })

    setTitle("")
    fetchTasks()
  }

  const toggleTask = async (taskId: string, completed: boolean) => {

    const token = localStorage.getItem("token")

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        completed: !completed
      })
    })

    fetchTasks()
  }

  const deleteTask = async (taskId: string) => {

    const token = localStorage.getItem("token")

    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    fetchTasks()
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Tareas del Proyecto
      </h1>

      <div className="flex gap-2 mb-6">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createTask}
          className="bg-black text-white px-4 rounded"
        >
          Crear
        </button>

      </div>

      <div className="space-y-3">

        {tasks.map((task) => (

          <div
            key={task.id}
            className="flex justify-between items-center border p-3 rounded"
          >

            <div
              onClick={() => toggleTask(task.id, task.completed)}
              className={`cursor-pointer ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500"
            >
              Eliminar
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}
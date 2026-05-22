"use client"

import { useEffect, useState } from "react"

type Task = {
  id: string
  title: string
  completed: boolean
}

export default function TasksList({ projectId }: { projectId: string }) {

  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  // Obtener tareas
  async function fetchTasks() {

    const res = await fetch(
      `/api/projects/${projectId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()

    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Crear tarea
  async function createTask() {

    if (!title) return

    await fetch(`/api/projects/${projectId}/tasks`, {
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

  // Completar tarea
  async function toggleTask(id: string, completed: boolean) {

    await fetch(`/api/tasks/${id}`, {
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

  // Eliminar tarea
  async function deleteTask(id: string) {

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    fetchTasks()
  }

  return (
    <div className="mt-6">

      <h2 className="text-xl font-bold mb-4">
        Tasks
      </h2>

      {/* Crear tarea */}

      <div className="flex gap-2 mb-4">

        <input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={createTask}
          className="bg-black text-white px-4 rounded"
        >
          Crear
        </button>

      </div>

      {/* Lista */}

      <div className="space-y-2">

        {tasks.map((task) => (

          <div
            key={task.id}
            className="flex justify-between items-center border p-3 rounded"
          >

            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task.id, task.completed)
                }
              />

              <span
                className={
                  task.completed
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {task.title}
              </span>

            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}
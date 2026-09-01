"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setTasks(data);
    }

    setLoading(false);
  };

  const createTask = async () => {
    if (!title.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
      }),
    });

    if (res.ok) {
      setTitle("");
      fetchTasks();
    }
  };

  const updateTaskStatus = async (taskId: string, currentStatus: string) => {
    const token = localStorage.getItem("token");

    let newStatus = "TODO";

    if (currentStatus === "TODO") {
      newStatus = "IN_PROGRESS";
    } else if (currentStatus === "IN_PROGRESS") {
      newStatus = "DONE";
    }

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  if (loading) {
    return (
      <div
        className="p-10
        text-slate-700
      "
      >
        Cargando tareas...
      </div>
    );
  }

  return (
    <div className="p-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Tareas del Proyecto</h1>

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

      {tasks.length === 0 ? (
        <p>No hay tareas</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div
                onClick={() => updateTaskStatus(task.id, task.status)}
                className={`cursor-pointer ${
                  task.status === "DONE" ? "line-through text-gray-500" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {task.status === "TODO" && "📝"}
                    {task.status === "IN_PROGRESS" && "🚧"}
                    {task.status === "DONE" && "✅"}
                  </span>

                  <span>{task.title}</span>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

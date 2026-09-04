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
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-[Inter,ui-sans-serif]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-[#DDD6C7] border-t-[#3B8763] animate-spin" />

          <p className="text-sm text-[#6B7268]">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-0 py-2 sm:py-4 font-[Inter,ui-sans-serif]">
      {/* HEADER */}

      <div className="mb-8">
        <p className="text-sm font-medium text-[#3B8763] mb-2">
          Tu espacio de trabajo
        </p>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-[Fraunces,Georgia,serif] tracking-tight text-[#14231F]">
              Tareas del proyecto
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#6B7268]">
              Organiza y completa las tareas de este proyecto.
            </p>
          </div>

          <div className="rounded-lg border border-[#DDD6C7] bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-[#8B978F]">
              Tareas
            </p>

            <p className="mt-1 text-lg font-semibold text-[#14231F]">
              {tasks.length}
            </p>
          </div>
        </div>
      </div>

      {/* CREATE TASK */}

      <div className="mb-8 rounded-lg border border-[#DDD6C7] bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[#1C231F]">Nueva tarea</h2>

        <p className="mt-1 text-sm text-[#6B7268]">
          Añade una tarea para mantener el proyecto en movimiento.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre de la tarea"
            className="
              w-full
              rounded-lg
              border
              border-[#DDD6C7]
              bg-[#FAF7F0]
              px-4
              py-3
              text-sm
              text-[#1C231F]
              placeholder:text-[#8B978F]
              outline-none
              transition
              focus:border-[#3B8763]
              focus:ring-2
              focus:ring-[#DDE8E1]
            "
          />

          <button
            onClick={createTask}
            className="
              rounded-lg
              bg-[#14231F]
              px-6
              py-3
              text-sm
              font-medium
              text-[#F5F2EA]
              transition-colors
              hover:bg-[#1C3029]
              sm:min-w-[120px]
            "
          >
            Crear tarea
          </button>
        </div>
      </div>

      {/* TASKS */}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-[#DDD6C7] bg-[#F1ECE1] p-8 sm:p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DDE8E1] text-2xl">
            📝
          </div>

          <h2 className="mt-5 text-xl font-[Fraunces,Georgia,serif] text-[#14231F]">
            No hay tareas todavía
          </h2>

          <p className="mt-2 text-sm text-[#6B7268]">
            Crea tu primera tarea para comenzar a trabajar en este proyecto.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-[Fraunces,Georgia,serif] text-[#14231F]">
                Tus tareas
              </h2>

              <p className="mt-1 text-sm text-[#6B7268]">
                Haz clic sobre una tarea para avanzar su estado.
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="
                  group
                  rounded-lg
                  border
                  border-[#DDD6C7]
                  bg-white
                  p-4
                  sm:p-5
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  transition-shadow
                  hover:shadow-sm
                "
              >
                <div
                  onClick={() => updateTaskStatus(task.id, task.status)}
                  className={`cursor-pointer min-w-0 ${
                    task.status === "DONE"
                      ? "line-through text-[#8B978F]"
                      : "text-[#1C231F]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F1ECE1]
                        text-base
                      "
                    >
                      {task.status === "TODO" && "📝"}
                      {task.status === "IN_PROGRESS" && "🚧"}
                      {task.status === "DONE" && "✅"}
                    </span>

                    <div className="min-w-0">
                      <span className="block break-words text-sm sm:text-base font-medium">
                        {task.title}
                      </span>

                      <span
                        className={`mt-1 block text-xs no-underline ${
                          task.status === "TODO"
                            ? "text-[#6B7268]"
                            : task.status === "IN_PROGRESS"
                              ? "text-[#9A783E]"
                              : "text-[#3B8763]"
                        }`}
                      >
                        {task.status === "TODO" && "Por hacer"}
                        {task.status === "IN_PROGRESS" && "En progreso"}
                        {task.status === "DONE" && "Completada"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="
                    shrink-0
                    rounded-lg
                    border
                    border-[#E5D4D1]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-[#A34E46]
                    transition-colors
                    hover:bg-[#F8ECEA]
                  "
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

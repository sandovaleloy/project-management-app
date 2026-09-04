"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TasksList({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Obtener tareas
  async function fetchTasks() {
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Crear tarea
  async function createTask() {
    if (!title) return;

    await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  }

  // Completar tarea
  async function toggleTask(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: !completed,
      }),
    });

    fetchTasks();
  }

  // Eliminar tarea
  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  }

  return (
    <div className="mt-8 w-full font-[Inter,ui-sans-serif]">
      {/* HEADER */}

      <div className="mb-5">
        <p className="text-sm font-medium text-[#3B8763] mb-1">Organización</p>

        <h2 className="text-2xl sm:text-3xl font-[Fraunces,Georgia,serif] tracking-tight text-[#14231F]">
          Tareas
        </h2>

        <p className="mt-1 text-sm text-[#6B7268]">
          Mantén tus tareas organizadas y al día.
        </p>
      </div>

      {/* CREAR TAREA */}

      <div
        className="
          rounded-lg
          border
          border-[#DDD6C7]
          bg-white
          p-5
          sm:p-6
        "
      >
        <h3 className="text-base font-semibold text-[#1C231F]">Nueva tarea</h3>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Nueva tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              min-w-0
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
              w-full
              sm:w-auto
              min-w-[110px]
              rounded-lg
              bg-[#14231F]
              px-5
              py-3
              text-sm
              font-medium
              text-[#F5F2EA]
              transition-colors
              hover:bg-[#1C3029]
            "
          >
            Crear tarea
          </button>
        </div>
      </div>

      {/* LISTA */}

      <div className="mt-6">
        {tasks.length === 0 ? (
          <div
            className="
              rounded-lg
              border
              border-[#DDD6C7]
              bg-[#F1ECE1]
              p-8
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#DDE8E1]
                text-xl
              "
            >
              📝
            </div>

            <p className="mt-4 text-sm font-medium text-[#14231F]">
              No hay tareas todavía
            </p>

            <p className="mt-1 text-sm text-[#6B7268]">
              Crea una tarea para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-lg
                  border
                  border-[#DDD6C7]
                  bg-white
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:p-5
                  transition-shadow
                  hover:shadow-sm
                "
              >
                <label className="flex min-w-0 items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="
                      h-4
                      w-4
                      shrink-0
                      cursor-pointer
                      accent-[#3B8763]
                    "
                  />

                  <span
                    className={`break-words text-sm sm:text-base ${
                      task.completed
                        ? "line-through text-[#8B978F]"
                        : "text-[#1C231F]"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="
                    self-end
                    rounded-lg
                    border
                    border-[#E5D4D1]
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-[#A34E46]
                    transition-colors
                    hover:bg-[#F8ECEA]
                    sm:self-auto
                  "
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

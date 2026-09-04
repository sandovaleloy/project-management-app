"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

type StatusType = "TODO" | "IN_PROGRESS" | "DONE";
type PriorityType = "LOW" | "MEDIUM" | "HIGH";

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<StatusType>("TODO");

  const [priority, setPriority] = useState<PriorityType>("MEDIUM");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const fetchTasks = async () => {
    try {
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
    } catch (error) {
      toast.error("Error cargando tareas");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      toast.error("Debes escribir un título");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          status,
          priority,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Tarea creada");

      setTitle("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setIsModalOpen(false);

      fetchTasks();
    } catch (error) {
      toast.error("Error creando tarea");
    }
  };

  const updateTaskStatus = async (taskId: string, status: StatusType) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
      );

      toast.success("Estado actualizado");
    } catch (error) {
      toast.error("Error actualizando tarea");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error();
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      toast.success("Tarea eliminada");
    } catch (error) {
      toast.error("Error eliminando tarea");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as StatusType;

    const task = tasks.find((task) => task.id === taskId);

    if (!task) return;

    if (task.status === newStatus) return;

    await updateTaskStatus(taskId, newStatus);
  };

  // =========================
  // KANBAN GROUPS
  // =========================

  const todoTasks = tasks.filter((task) => task.status === "TODO");

  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");

  const doneTasks = tasks.filter((task) => task.status === "DONE");

  if (loading) {
    return (
      <div
        className="
          min-h-[50vh]
          flex
          items-center
          justify-center
          text-[#6B7268]
        "
      >
        Cargando tareas...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          sm:justify-between
          gap-6
          mb-8
        "
      >
        <div>
          <Link
            href="/dashboard/projects"
            className="
              inline-flex
              items-center
              text-sm
              font-medium
              text-[#3B8763]
              hover:text-[#2F6E50]
              transition-colors
              mb-4
            "
          >
            ← Volver a proyectos
          </Link>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-[Fraunces,Georgia,serif]
              tracking-tight
              text-[#1C231F]
            "
          >
            Tareas del proyecto
          </h1>

          <p
            className="
              mt-2
              text-[#6B7268]
            "
          >
            Organiza y sigue el progreso de tus tareas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            inline-flex
            items-center
            justify-center
            px-5
            py-3
            rounded-lg

            bg-[#1C231F]
            hover:bg-[#14231F]

            text-[#F5F2EA]
            font-medium

            transition-colors

            w-full
            sm:w-auto
          "
        >
          + Nueva tarea
        </button>
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              bg-[#14231F]/50
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                bg-[#FAF7F0]
                w-full
                max-w-lg
                rounded-xl
                border
                border-[#DDD6C7]
                shadow-2xl
                p-6
                md:p-8
                relative
              "
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  absolute
                  top-4
                  right-4
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-[#6B7268]
                  hover:bg-[#E9E4D9]
                  hover:text-[#1C231F]
                  transition-colors
                "
              >
                ✕
              </button>

              <div className="mb-6 pr-8">
                <h2
                  className="
                    text-2xl
                    font-[Fraunces,Georgia,serif]
                    text-[#1C231F]
                  "
                >
                  Nueva tarea
                </h2>

                <p
                  className="
                    text-sm
                    text-[#6B7268]
                    mt-1
                  "
                >
                  Añade una tarea a este proyecto.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-[#1C231F]
                      mb-2
                    "
                  >
                    Título
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la tarea"
                    className="
                      border
                      border-[#DDD6C7]
                      bg-white
                      text-[#1C231F]
                      placeholder:text-[#9A9F97]
                      p-3
                      rounded-lg
                      w-full
                      outline-none
                      focus:border-[#3B8763]
                      focus:ring-2
                      focus:ring-[#3B8763]/10
                      transition
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-[#1C231F]
                      mb-2
                    "
                  >
                    Estado
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusType)}
                    className="
                      border
                      border-[#DDD6C7]
                      bg-white
                      text-[#1C231F]
                      p-3
                      rounded-lg
                      w-full
                      outline-none
                      focus:border-[#3B8763]
                      focus:ring-2
                      focus:ring-[#3B8763]/10
                      transition
                    "
                  >
                    <option value="TODO">TODO</option>

                    <option value="IN_PROGRESS">IN PROGRESS</option>

                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-[#1C231F]
                      mb-2
                    "
                  >
                    Prioridad
                  </label>

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as PriorityType)
                    }
                    className="
                      border
                      border-[#DDD6C7]
                      bg-white
                      text-[#1C231F]
                      p-3
                      rounded-lg
                      w-full
                      outline-none
                      focus:border-[#3B8763]
                      focus:ring-2
                      focus:ring-[#3B8763]/10
                      transition
                    "
                  >
                    <option value="LOW">LOW</option>

                    <option value="MEDIUM">MEDIUM</option>

                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <button
                  onClick={createTask}
                  className="
                    w-full
                    bg-[#1C231F]
                    hover:bg-[#14231F]
                    text-[#F5F2EA]
                    py-3
                    rounded-lg
                    font-medium
                    transition-colors
                    mt-2
                  "
                >
                  Crear tarea
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KANBAN */}

      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
            lg:gap-5
          "
        >
          <Column
            title="TODO"
            tasks={todoTasks}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />

          <Column
            title="IN_PROGRESS"
            tasks={inProgressTasks}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />

          <Column
            title="DONE"
            tasks={doneTasks}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />
        </div>
      </DndContext>
    </div>
  );
}

/* ========================= */
/* DRAGGABLE TASK */
/* ========================= */

function DraggableTask({
  task,
  children,
}: {
  task: Task;
  children: (dragHandleProps: any) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        ...listeners,
        ...attributes,
      })}
    </div>
  );
}

interface ColumnProps {
  title: string;
  tasks: Task[];

  updateTaskStatus: (taskId: string, status: StatusType) => void;

  deleteTask: (taskId: string) => void;
}

function Column({ title, tasks, updateTaskStatus, deleteTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  const columnTitle =
    title === "TODO"
      ? "Por hacer"
      : title === "IN_PROGRESS"
        ? "En progreso"
        : "Completadas";

  const columnDescription =
    title === "TODO"
      ? "Tareas pendientes"
      : title === "IN_PROGRESS"
        ? "Tareas en curso"
        : "Tareas terminadas";

  return (
    <div
      ref={setNodeRef}
      className="
        bg-[#F1ECE1]
        border
        border-[#DDD6C7]
        rounded-lg
        p-4
        min-h-[420px]
        transition-colors
      "
    >
      {/* COLUMN HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-5
          pb-4
          border-b
          border-[#DDD6C7]
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-[#1C231F]
            "
          >
            {columnTitle}
          </h2>

          <p
            className="
              text-xs
              text-[#6B7268]
              mt-1
            "
          >
            {columnDescription}
          </p>
        </div>

        <span
          className="
            min-w-7
            h-7
            px-2
            rounded-full
            bg-white
            border
            border-[#DDD6C7]
            flex
            items-center
            justify-center
            text-xs
            font-medium
            text-[#6B7268]
          "
        >
          {tasks.length}
        </span>
      </div>

      {/* EMPTY COLUMN */}

      {tasks.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
            py-12
            px-4
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-[#E4DED1]
              flex
              items-center
              justify-center
              text-xl
              mb-4
            "
          >
            📝
          </div>

          <h3
            className="
              text-[#1C231F]
              font-medium
            "
          >
            No hay tareas
          </h3>

          <p
            className="
              text-[#6B7268]
              text-sm
              mt-2
              max-w-xs
              leading-relaxed
            "
          >
            Crea una tarea para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <DraggableTask key={task.id} task={task}>
              {(dragHandleProps) => (
                <div
                  className="
                    border
                    border-[#DDD6C7]
                    rounded-lg
                    p-4
                    bg-white
                    hover:border-[#BFC9C1]
                    transition-colors
                  "
                >
                  {/* TASK HEADER */}

                  <div
                    className="
                      flex
                      justify-between
                      items-start
                      gap-3
                      mb-3
                    "
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        {...dragHandleProps}
                        className="
                          cursor-grab
                          active:cursor-grabbing
                          text-[#9A9F97]
                          hover:text-[#3B8763]
                          transition-colors
                          select-none
                          pt-0.5
                          shrink-0
                        "
                      >
                        ☰
                      </div>

                      <h3
                        className="
                          font-medium
                          break-words
                          text-[#1C231F]
                          leading-snug
                        "
                      >
                        {task.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="
                        text-xs
                        text-[#9A625D]
                        hover:text-[#A34E46]
                        transition-colors
                        shrink-0
                      "
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* PRIORITY */}

                  <p
                    className={`
                      text-xs
                      font-medium
                      mb-3
                      ${
                        task.priority === "HIGH"
                          ? "text-[#A34E46]"
                          : task.priority === "MEDIUM"
                            ? "text-[#9A783E]"
                            : "text-[#3B8763]"
                      }
                    `}
                  >
                    Prioridad: {task.priority}
                  </p>

                  {/* STATUS */}

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value as StatusType)
                    }
                    className="
                      border
                      border-[#DDD6C7]
                      rounded-lg
                      p-2
                      w-full
                      bg-[#FAF7F0]
                      text-[#1C231F]
                      text-sm
                      outline-none
                      focus:border-[#3B8763]
                      focus:ring-2
                      focus:ring-[#3B8763]/10
                      transition
                    "
                  >
                    <option value="TODO">TODO</option>

                    <option value="IN_PROGRESS">IN PROGRESS</option>

                    <option value="DONE">DONE</option>
                  </select>
                </div>
              )}
            </DraggableTask>
          ))}
        </div>
      )}
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { CSS } from "@dnd-kit/utilities"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent
} from "@dnd-kit/core"
import Link from "next/link"

interface Task {
  id: string
  title: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
}

type StatusType = "TODO" | "IN_PROGRESS" | "DONE"
type PriorityType = "LOW" | "MEDIUM" | "HIGH"

export default function ProjectTasksPage() {

  const params = useParams()
  const projectId = params.id as string
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  
  const [status, setStatus] =
    useState<StatusType>("TODO")

  const [priority, setPriority] =
    useState<PriorityType>("MEDIUM")
  
  const [isModalOpen, setIsModalOpen] =
  useState(false)

  useEffect(() => {

    if (projectId) {
      fetchTasks()
    }

  }, [projectId])

  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token")

      const res = await fetch(
        `/api/projects/${projectId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (Array.isArray(data)) {
        setTasks(data)
      }

    } catch (error) {


      toast.error("Error cargando tareas")

    } finally {

      setLoading(false)

    }

  }

  const createTask = async () => {

    if (!title.trim()) {
      toast.error("Debes escribir un título")
      return
    }

    try {

      const token = localStorage.getItem("token")

      const res = await fetch(
        `/api/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            status,
            priority
          })
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      toast.success("Tarea creada")

      setTitle("")
      setStatus("TODO")
      setPriority("MEDIUM")
      setIsModalOpen(false)

      fetchTasks()

    } catch (error) {

      toast.error("Error creando tarea")

    }

  }

  const updateTaskStatus = async (
    taskId: string,
    status: StatusType
  ) => {

    try {

      const token = localStorage.getItem("token")

      const res = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status
          })
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, status }
            : task
        )
      )

      toast.success("Estado actualizado")

    } catch (error) {

      toast.error("Error actualizando tarea")

    }

  }

  const deleteTask = async (
    taskId: string
  ) => {

    try {

      const token = localStorage.getItem("token")

      const res = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      setTasks(prev =>
        prev.filter(task =>
          task.id !== taskId
        )
      )

      toast.success("Tarea eliminada")

    } catch (error) {

      toast.error("Error eliminando tarea")

    }

  }

  const handleDragEnd = async (
  event: DragEndEvent
) => {

  const { active, over } = event

  if (!over) return

  const taskId = active.id as string
  const newStatus = over.id as StatusType

  const task = tasks.find(
    task => task.id === taskId
  )

  if (!task) return

  if (task.status === newStatus) return

  await updateTaskStatus(
    taskId,
    newStatus
  )

}

  // =========================
  // KANBAN GROUPS
  // =========================

  const todoTasks = tasks.filter(
    task => task.status === "TODO"
  )

  const inProgressTasks = tasks.filter(
    task => task.status === "IN_PROGRESS"
  )

  const doneTasks = tasks.filter(
    task => task.status === "DONE"
  )

  if (loading) {

    return (
      <div className="p-10">
        Cargando tareas...
      </div>
    )

  }

  return (

    <div className="p-10 ">

      <Link
          href="/dashboard/projects"
          className="
            inline-flex
            items-center
            text-blue-600
            hover:text-blue-500
            font-medium
            mb-6
          "
        >
          ← Volver a proyectos
      </Link>

      <h1 className="text-5xl font-extrabold mb-8 text-slate-700 tracking-tight">
        Tareas del Proyecto
      </h1>

      <div className="mb-8 flex justify-end">

  <button
    onClick={() => setIsModalOpen(true)}
    className="
      bg-black
      text-white
      px-6
      py-3
      rounded-xl
      shadow-lg
      hover:scale-105
      hover:bg-gray-800
      transition-all
      duration-200
    "
  >
    + Nueva tarea
  </button>

      </div>
      
      <AnimatePresence>

{isModalOpen && (

  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="
    fixed
      inset-0
      bg-black/40
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-50
    "
  >

    <motion.div
  initial={{
    opacity: 0,
    scale: 0.9,
    y: 40
  }}
  animate={{
    opacity: 1,
    scale: 1,
    y: 0
  }}
  exit={{
    opacity: 0,
    scale: 0.9,
    y: 40
  }}
  transition={{
    duration: 0.25
  }}
  className="
      bg-slate-100
        w-full
        max-w-lg
        rounded-3xl
        shadow-2xl
        p-8
        relative
      "
    >

      <button
        onClick={() =>
          setIsModalOpen(false)
        }
        className="
          absolute
          top-4
          right-4
          text-gray-400
          hover:text-black
          text-xl
        "
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-6 text-black">
        Nueva tarea
      </h2>

      <div className="space-y-4">

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Título de la tarea"
          className="
            border
            border-slate-700
            bg-slate-800
            text-white
            p-4
            rounded-xl
            w-full
          "
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as StatusType
            )
          }
          className="
            border
            border-slate-700
            bg-slate-800
            text-white
            p-4
            rounded-xl
            w-full
          "
        >

          <option value="TODO">
            TODO
          </option>

          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>

          <option value="DONE">
            DONE
          </option>

        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
              e.target.value as PriorityType
            )
          }
          className="
            border
          border-slate-700
          bg-slate-800
          text-white
          p-4
          rounded-xl
          w-full
          "
        >

          <option value="LOW">
            LOW
          </option>

          <option value="MEDIUM">
            MEDIUM
          </option>

          <option value="HIGH">
            HIGH
          </option>

        </select>

        <button
          onClick={createTask}
          className="
            w-full
            bg-black
            text-white
            py-4
            rounded-xl
            hover:bg-gray-800
            transition-all
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

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

  )

}

/* ========================= */
/* COLUMN COMPONENT */
/* ========================= */

function DraggableTask({
  task,
  children
}: {
  task: Task
  children: (
    dragHandleProps: any
  ) => React.ReactNode
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: task.id
  })

const style = {
  transform: CSS.Translate.toString(transform),
  transition: "none",
  opacity: isDragging ? 0.85 : 1,
  zIndex: isDragging ? 50 : "auto"
}

  return (

    <div
  ref={setNodeRef}
  style={style}
>
      {children({
        ...listeners,
        ...attributes
      })}
    </div>

  )
}

interface ColumnProps {
  title: string
  tasks: Task[]

  updateTaskStatus: (
    taskId: string,
    status: StatusType
  ) => void

  deleteTask: (
    taskId: string
  ) => void
}

function Column({
  title,
  tasks,
  updateTaskStatus,
  deleteTask
}: ColumnProps) {

  const { setNodeRef } = useDroppable({
  id: title
  })
  

  
  return (

    <div
      ref={setNodeRef}
      className="
        bg-slate-800 border border-slate-700
        rounded-2xl
        shadow
        p-4
        min-h-[400px]
        transition-all
        duration-200
      "
    >

      <h2 className="text-xl font-bold mb-4 text-slate-100">
        {title}
      </h2>

      {tasks.length === 0 ? (

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
            py-10
            px-4
          "
        >

            <div className="text-4xl mb-3">
              📝
            </div>

            <h3
              className="
                text-white
                font-semibold
                text-lg
              "
            >
              No hay tareas
            </h3>

            <p
              className="
                text-slate-400
                text-sm
                mt-2
                max-w-xs
              "
            >
              Crea la primera tarea y comienza a trabajar en este proyecto.
            </p>

          </div>

        ) : (

        <div className="space-y-4">

          {tasks.map((task) => (

            <DraggableTask
              key={task.id}
              task={task}
              >

              {(dragHandleProps) => (

                <div
                  className="
                  border
                  rounded-xl
                  p-4
                  bg-slate-900
                  shadow-sm
                  hover:shadow-md
                  transition-shadow
                  "
                  >
              <div className="flex justify-between items-start mb-3 gap-3">

                <div
                    {...dragHandleProps}
                    className="
                      cursor-grab
                      active:cursor-grabbing
                      text-gray-400
                      mb-2
                      w-fit
                    "
                  >
                    ☰
                  </div>                    

                <h3 className="font-semibold break-words text-white">
                  {task.title}
                </h3>

                <button
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Eliminar
                </button>

              </div>

              <p
                className={`text-sm font-medium mb-3 ${
                  task.priority === "HIGH"
                    ? "text-red-500"
                    : task.priority === "MEDIUM"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Prioridad: {task.priority}
              </p>

              <select
                value={task.status}
                onChange={(e) =>
                  updateTaskStatus(
                    task.id,
                    e.target.value as StatusType
                  )
                }
                className="
                  border
                  border-slate-300
                  rounded-lg
                  p-2
                  w-full
                  bg-slate-900 
                  text-white
                "
              >

                <option value="TODO">
                  TODO
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="DONE">
                  DONE
                </option>

              </select>

            </div>

  )}

</DraggableTask>

          ))}

        </div>

      )}

    </div>

  )

}
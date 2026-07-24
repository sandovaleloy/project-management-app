"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";

type Project = {
  id: string;
  name: string;
};

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      toast.error("Error al cargar los proyectos");
    }
  };

  const createProject = async () => {
    if (!name.trim()) {
      return;
    }

    setLoadingCreate(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error();
      }

      setProjects((prev) => [data, ...prev]);

      setName("");

      toast.success("Proyecto creado");
    } catch (error) {
      toast.error("Error al crear el proyecto");
    } finally {
      setLoadingCreate(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setDeletingId(projectId);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error();
      }

      setProjects((prev) => prev.filter((project) => project.id !== projectId));

      toast.success("Proyecto eliminado");
    } catch {
      toast.error("Error al eliminar el proyecto");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* HEADER */}

      <div>
        <h2 className="text-3xl font-bold text-slate-400">Proyectos</h2>

        <p className="text-slate-400 mt-2">Gestiona todos tus proyectos</p>
      </div>

      {/* CREATE PROJECT */}

      <div
        className="
          bg-[#111827]
          border
          border-slate-700
          rounded-2xl
          p-5
          shadow-lg

          flex
          flex-col
          sm:flex-row

          gap-3
        "
      >
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
              flex-1
              min-w-0

              bg-[#0F172A]
              border
              border-slate-600

              text-white
              placeholder:text-slate-400

              p-3

              rounded-xl
                      
              outline-none

              focus:border-blue-500

              transition-all
            "
        />

        <button
          onClick={createProject}
          disabled={loadingCreate}
          className="
            w-full
            sm:w-auto

            py-3
            px-6

            bg-blue-600
            hover:bg-blue-500

            text-white

            rounded-xl

            transition-all
            shadow-md

            hover:scale-105

            disabled:opacity-70
            disabled:cursor-not-allowed

            flex
            items-center
            justify-center
            gap-2
          "
        >
          {loadingCreate ? (
            <>
              <span
                className="
                  w-5
                  h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              />
              Creando...
            </>
          ) : (
            "Crear"
          )}
        </button>
      </div>

      {/* PROJECTS */}

      {projects.length === 0 ? (
        <div
          className="
            bg-[#111827]
            border
            border-slate-700
            rounded-2xl
            p-12
            text-center
            text-slate-400
            shadow-lg
          "
        >
          No tienes proyectos todavía
        </div>
      ) : (
        <div className="grid gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="
                bg-[#111827]
                border
                border-slate-700

                rounded-2xl

                p-5

                shadow-lg

                flex
                flex-col
                sm:flex-row

                items-start
                sm:items-center

                justify-between

                gap-4

                transition-all
                duration-200

                hover:border-blue-500
                hover:shadow-blue-900/20
                hover:-translate-y-1
              "
            >
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="
                  w-full

                  text-white

                  font-semibold

                  text-lg

                  break-words

                  hover:text-blue-400

                  transition-colors
                "
              >
                {project.name}
              </Link>

              <button
                onClick={() => setProjectToDelete(project)}
                disabled={deletingId === project.id}
                className="
                  self-end
                  sm:self-auto

                  px-3
                  py-2

                  rounded-lg

                  text-red-400

                  hover:bg-red-500/10
                  hover:text-red-300

                  transition-colors

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {deletingId === project.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={projectToDelete !== null}
        title="Eliminar proyecto"
        description="Esta acción no se puede deshacer."
        onCancel={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (!projectToDelete) return;

          await deleteProject(projectToDelete.id);

          setProjectToDelete(null);
        }}
      />
    </div>
  );
}

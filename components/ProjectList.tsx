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
    <div className="w-full max-w-5xl mx-auto space-y-8 font-[Inter,ui-sans-serif]">
      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-[#3B8763] mb-2">
          Tu espacio de trabajo
        </p>

        <h2 className="text-3xl sm:text-4xl font-[Fraunces,Georgia,serif] tracking-tight text-[#14231F]">
          Proyectos
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#6B7268]">
          Gestiona todos tus proyectos en un solo lugar.
        </p>
      </div>

      {/* CREATE PROJECT */}

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
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-[#1C231F]">
            Nuevo proyecto
          </h3>

          <p className="mt-1 text-sm text-[#6B7268]">
            Crea un proyecto para comenzar a organizar tus tareas.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              flex-1
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
            onClick={createProject}
            disabled={loadingCreate}
            className="
              w-full
              sm:w-auto
              min-w-[120px]
              rounded-lg
              bg-[#14231F]
              px-6
              py-3
              text-sm
              font-medium
              text-[#F5F2EA]
              transition-colors
              hover:bg-[#1C3029]
              disabled:cursor-not-allowed
              disabled:opacity-60
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
                    h-4
                    w-4
                    rounded-full
                    border-2
                    border-[#F5F2EA]
                    border-t-transparent
                    animate-spin
                  "
                />
                Creando...
              </>
            ) : (
              "Crear proyecto"
            )}
          </button>
        </div>
      </div>

      {/* PROJECTS */}

      {projects.length === 0 ? (
        <div
          className="
            rounded-lg
            border
            border-[#DDD6C7]
            bg-[#F1ECE1]
            p-10
            sm:p-12
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#DDE8E1]
              text-2xl
            "
          >
            📁
          </div>

          <h3 className="mt-5 text-xl font-[Fraunces,Georgia,serif] text-[#14231F]">
            No tienes proyectos todavía
          </h3>

          <p className="mt-2 text-sm text-[#6B7268]">
            Crea tu primer proyecto para comenzar a organizar tu trabajo.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-[Fraunces,Georgia,serif] text-[#14231F]">
                Tus proyectos
              </h3>

              <p className="mt-1 text-sm text-[#6B7268]">
                Selecciona un proyecto para ver sus tareas.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#E8EFEA] px-3 py-1 text-xs font-medium text-[#3B8763]">
              {projects.length}{" "}
              {projects.length === 1 ? "proyecto" : "proyectos"}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="
                  rounded-lg
                  border
                  border-[#DDD6C7]
                  bg-white
                  p-5
                  transition-shadow
                  hover:shadow-md
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="
                      min-w-0
                      flex-1
                      group
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#F1ECE1]
                          text-lg
                        "
                      >
                        📁
                      </div>

                      <div className="min-w-0">
                        <span
                          className="
                            block
                            break-words
                            text-base
                            font-semibold
                            text-[#1C231F]
                            transition-colors
                            group-hover:text-[#3B8763]
                          "
                        >
                          {project.name}
                        </span>

                        <span className="mt-1 block text-xs text-[#8B978F]">
                          Ver tareas del proyecto
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => setProjectToDelete(project)}
                    disabled={deletingId === project.id}
                    className="
                      shrink-0
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
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {deletingId === project.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
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

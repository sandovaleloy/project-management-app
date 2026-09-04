"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setProjects(data);
    }

    setLoading(false);
  };

  const createProject = async () => {
    if (!name.trim()) return;

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

    if (res.ok) {
      setName("");
      fetchProjects();
    } else {
      alert("Error creando proyecto");
    }
  };

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
        Cargando proyectos...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* HEADER */}

      <div className="mb-10">
        <p
          className="
            text-sm
            font-medium
            text-[#3B8763]
            mb-2
          "
        >
          Tu espacio de trabajo
        </p>

        <h1
          className="
            text-4xl
            md:text-5xl
            font-[Fraunces,Georgia,serif]
            tracking-tight
            text-[#1C231F]
          "
        >
          Mis proyectos
        </h1>

        <p
          className="
            text-[#6B7268]
            mt-3
            text-base
            md:text-lg
          "
        >
          Crea y organiza tus proyectos en un solo lugar.
        </p>
      </div>

      {/* CREATE PROJECT */}

      <div
        className="
          bg-white
          border
          border-[#DDD6C7]
          rounded-lg
          p-5
          md:p-6
          mb-8
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-[#1C231F]
            mb-1
          "
        >
          Nuevo proyecto
        </h2>

        <p
          className="
            text-sm
            text-[#6B7268]
            mb-4
          "
        >
          Añade un proyecto para comenzar a organizar tus tareas.
        </p>

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
          "
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del proyecto"
            className="
              border
              border-[#DDD6C7]
              bg-[#FAF7F0]
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

          <button
            onClick={createProject}
            className="
              bg-[#1C231F]
              hover:bg-[#14231F]

              text-[#F5F2EA]
              font-medium

              px-6
              py-3

              rounded-lg

              transition-colors

              w-full
              sm:w-auto
              shrink-0
            "
          >
            Crear
          </button>
        </div>
      </div>

      {/* PROJECTS */}

      <div>
        <div
          className="
            flex
            items-end
            justify-between
            mb-5
          "
        >
          <div>
            <h2
              className="
                text-2xl
                md:text-3xl
                font-[Fraunces,Georgia,serif]
                text-[#1C231F]
              "
            >
              Mis proyectos
            </h2>

            <p
              className="
                text-sm
                text-[#6B7268]
                mt-1
              "
            >
              {projects.length}{" "}
              {projects.length === 1 ? "proyecto" : "proyectos"}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div
            className="
              bg-[#F1ECE1]
              border
              border-[#DDD6C7]
              rounded-lg

              p-8
              md:p-12

              text-center
            "
          >
            <div
              className="
                w-14
                h-14
                mx-auto
                mb-5

                rounded-full
                bg-[#DDE8E1]

                flex
                items-center
                justify-center

                text-2xl
              "
            >
              📁
            </div>

            <h3
              className="
                text-xl
                font-[Fraunces,Georgia,serif]
                text-[#1C231F]
              "
            >
              No tienes proyectos todavía
            </h3>

            <p
              className="
                text-[#6B7268]
                text-sm
                mt-2
                max-w-md
                mx-auto
                leading-relaxed
              "
            >
              Crea tu primer proyecto utilizando el formulario de arriba para
              comenzar a organizar tus tareas.
            </p>
          </div>
        ) : (
          <ul
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {projects.map((p) => (
              <li
                key={p.id}
                className="
                  bg-white
                  border
                  border-[#DDD6C7]
                  rounded-lg
                  p-5

                  hover:border-[#BFC9C1]

                  transition-colors
                "
              >
                <a
                  href={`/projects/${p.id}`}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    group
                  "
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="
                        w-11
                        h-11
                        rounded-lg
                        bg-[#E8EFEA]

                        flex
                        items-center
                        justify-center

                        text-lg
                        shrink-0
                      "
                    >
                      📁
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          font-medium
                          text-[#1C231F]
                          truncate

                          group-hover:text-[#3B8763]

                          transition-colors
                        "
                      >
                        {p.name}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-[#8B918A]
                          mt-1
                        "
                      >
                        Ver proyecto
                      </p>
                    </div>
                  </div>

                  <span
                    className="
                      text-[#9A9F97]
                      group-hover:text-[#3B8763]
                      transition-colors
                      text-lg
                      shrink-0
                    "
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

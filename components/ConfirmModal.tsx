"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#14231F]/70
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-lg
          border
          border-[#DDD6C7]
          bg-[#FAF7F0]
          p-6
          sm:p-7
          shadow-2xl
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#F8ECEA]
              text-2xl
            "
          >
            🗑️
          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-[Fraunces,Georgia,serif]
              tracking-tight
              text-[#14231F]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#6B7268]
            "
          >
            {description}
          </p>
        </div>

        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <button
            onClick={onCancel}
            className="
              flex-1
              rounded-lg
              border
              border-[#DDD6C7]
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              text-[#1C231F]
              transition-colors
              hover:bg-[#F1ECE1]
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              flex-1
              rounded-lg
              bg-[#A34E46]
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-[#8F4039]
            "
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

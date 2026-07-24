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
        bg-black/60
        flex
        items-center
        justify-center
        p-4
        z-50
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-slate-900
          border
          border-slate-700
          shadow-2xl
          p-6
        "
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🗑️</div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-3
              text-slate-400
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
            sm:flex-row
            gap-3
          "
        >
          <button
            onClick={onCancel}
            className="
              flex-1
              py-3
              rounded-xl
              bg-slate-700
              hover:bg-slate-600
              text-white
              transition
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              flex-1
              py-3
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              transition
            "
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

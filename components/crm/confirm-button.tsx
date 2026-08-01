"use client";

import { useFormStatus } from "react-dom";

/**
 * Envío destructivo dentro de un <form action={...}>: pide confirmación antes
 * de dejar pasar el submit.
 */
export default function ConfirmButton({
  children,
  pendingLabel,
  message,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  message: string;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

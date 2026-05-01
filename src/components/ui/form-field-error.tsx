interface FormFieldErrorProps {
  id: string;
  message?: string;
}

export function FormFieldError({ id, message }: FormFieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} aria-live="polite" className="text-[11px] text-(--negative) font-mono">
      {message}
    </p>
  );
}

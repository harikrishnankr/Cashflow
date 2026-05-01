"use client";

import { useState } from "react";
import { z } from "zod";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<S extends z.ZodObject<z.ZodRawShape>>(
  schema: S,
  initial: z.infer<S>
) {
  type T = z.infer<S>;

  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  function setValue<K extends keyof T>(key: K, value: T[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(onValid: (data: T) => void | Promise<void>) {
    return async () => {
      const result = schema.safeParse(values);
      if (!result.success) {
        const fieldErrors: FieldErrors<T> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof T;
          if (key !== undefined && !fieldErrors[key]) {
            fieldErrors[key] = issue.message;
          }
        }
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      await onValid(result.data as T);
    };
  }

  function errorId(field: keyof T) {
    return `field-error-${String(field)}`;
  }

  function fieldProps(field: keyof T) {
    const hasError = !!errors[field];
    return {
      "aria-invalid": hasError ? (true as const) : undefined,
      "aria-describedby": hasError ? errorId(field) : undefined,
    };
  }

  return { values, setValue, errors, handleSubmit, fieldProps, errorId };
}

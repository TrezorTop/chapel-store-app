import { useState } from "react";
import { isBoolean } from "../functions/boolean";

export const useForm = <T>(defaultValues?: Partial<T>) => {
  const [form, setForm] = useState<Partial<T>>(defaultValues ?? {});
  const [error, setError] = useState<string>("");

  const updateForm = (values: { [key in keyof T]?: T[key] }) => {
    setForm({ ...form, ...values });
    setError("");
  };

  const isFieldValid = (validators: ((value: any) => boolean | string)[], value: string | undefined) => {
    if (!validators.every((validator) => isBoolean(validator(String(value) ?? "")))) return false;

    return true;
  };

  return {
    form,
    updateForm,
    isFieldValid,
    error,
    setError,
  };
};

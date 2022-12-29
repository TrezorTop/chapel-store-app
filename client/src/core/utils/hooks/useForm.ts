import { useState } from "react";

export const useForm = <T>() => {
  const [form, setForm] = useState<Partial<T>>({});

  const updateForm = (field: keyof T, value: T[keyof T]) => {
    setForm({ ...form, [field]: value });
  };

  return {
    form,
    updateForm,
  };
};

import { useEffect, useState } from "react";

type OptionsProps<T> = {
  [key in keyof T]?: {
    required?: boolean;
    minLenght?: number;
    maxLenght?: number;
    isEqual?: keyof T;
  };
};

type Error<T> = {
  [key in keyof T]?: string;
};

export const useForm = <T>(
  defaultState: Partial<T> = {},
  options: OptionsProps<T> = {},
) => {
  const [form, setForm] = useState<Partial<T>>(defaultState);
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(
      Object.keys(options).every((key) => {
        const value = form[key as keyof T];
        const field = options[key as keyof T];

        if (field?.required) {
          if (!value) return false;
        }

        if (field?.isEqual) {
          if (value !== form[field?.isEqual!]) return false;
        }

        if (field?.maxLenght) {
          if (String(value).length > field?.maxLenght!) return false;
        }

        if (field?.minLenght) {
          if (String(value).length < field?.minLenght!) return false;
        }

        return true;
      }),
    );
  }, [form]);

  const updateForm = (field: keyof T, value: T[keyof T]) => {
    setForm({ ...form, [field]: value });
  };

  return {
    form,
    valid,
    updateForm,
  };
};

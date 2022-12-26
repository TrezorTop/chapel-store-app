import { useEffect, useRef, useState } from "react";

import { Validator } from "../../../../../shared/validators/types";

export const useForm = <T>(validators?: Validator<T>, defaultState?: Partial<T>) => {
  const [isValid, setIsValid] = useState<boolean>();
  const [form, setForm] = useState<Partial<T>>(defaultState ?? {});

  const prevFormValue = useRef<Partial<T>>(form);

  useEffect(() => {
    Object.entries(form).forEach((input) => {
      if (input[1] !== prevFormValue.current[input[0] as keyof T]) {
        validators?.[input[0] as keyof T].forEach((validator) => {
          if (validator(input[1] as T[keyof T])) {
            console.log("invalid");
          }
        });
      }
    });

    prevFormValue.current = form;
  }, [form]);

  const updateForm = (field: keyof T, value: T[keyof T]) => {
    setForm({ ...form, [field]: value });
  };

  return {
    form,
    updateForm,
  };
};

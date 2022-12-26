import { useEffect, useRef, useState } from "react";

import { Validator } from "../../../../../shared/types";

type TErrors = {
  [key: string]: string[] | undefined;
};

export const useForm = <T>(validators?: Validator<T>, defaultState?: Partial<T>) => {
  const [form, setForm] = useState<Partial<T>>(defaultState ?? {});
  const [isValid, setIsValid] = useState<boolean>();
  const [errors, setErrors] = useState<TErrors>();

  const prevFormValue = useRef<Partial<T>>(form);

  useEffect(() => {
    Object.keys(form).forEach((inputKey) => {
      const inputErrors: string[] = [];
      validators?.[inputKey as keyof T].some((validator) => {
        const errorMessage = validator(form[inputKey as keyof T] as T[keyof T], form);

        if (typeof errorMessage === "string") {
          inputErrors.push(errorMessage);
        }
      });

      setErrors({ ...errors, [inputKey]: inputErrors.length ? inputErrors : undefined });
    });
  }, []);

  useEffect(() => {
    if (!errors) return setIsValid(true);
    if (!Object.keys(errors).every((error) => errors?.[error]?.length)) return setIsValid(true);

    return setIsValid(false);
  }, [errors]);

  // useEffect(() => {
  //   Object.keys(form).forEach((inputKey) => {
  //     if (form[inputKey as keyof T] !== prevFormValue.current[inputKey as keyof T]) {
  //       const inputErrors: string[] = [];
  //       validators?.[inputKey as keyof T].some((validator) => {
  //         const errorMessage = validator(form[inputKey as keyof T] as T[keyof T], form);

  //         if (typeof errorMessage === "string") {
  //           inputErrors.push(errorMessage);
  //         }
  //       });

  //       setErrors({ ...errors, [inputKey]: inputErrors.length ? inputErrors : undefined });
  //     }
  //   });

  //   prevFormValue.current = form;
  // }, [form]);

  const updateForm = (field: keyof T, value: T[keyof T]) => {
    setForm({ ...form, [field]: value });
  };

  return {
    form,
    updateForm,
    errors,
    isValid,
  };
};

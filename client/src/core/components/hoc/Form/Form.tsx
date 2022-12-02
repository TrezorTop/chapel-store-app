import React, { FC, FormHTMLAttributes, ReactNode, useRef } from "react";
import useEventListener from "../../../utils/hooks/useEventListener";

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const Form: FC<IFormProps> = ({ children, ...props }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEventListener(
    "submit",
    (event) => {
      event.preventDefault();
    },
    formRef,
  );

  return <form {...props}>{children}</form>;
};

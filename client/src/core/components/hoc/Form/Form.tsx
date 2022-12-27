import classNames from "classnames";
import React, { FC, FormHTMLAttributes, ReactNode, useRef } from "react";
import { useEventListener } from "usehooks-ts";

import s from "./Form.module.scss";

interface IFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  gaps?: boolean;
}

export const Form: FC<IFormProps> = ({ children, className, gaps = true, ...props }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEventListener(
    "submit",
    (event) => {
      event.preventDefault();
    },
    formRef,
  );

  return (
    <form className={classNames({ [s.gaps]: gaps }, className)} {...props}>
      {children}
    </form>
  );
};

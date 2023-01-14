import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material";
import classNames from "classnames";
import React, { FC } from "react";

import s from "./Textarea.module.scss";

type TTextareaProps = TextareaAutosizeProps & {};

export const Textarea: FC<TTextareaProps> = ({ className, ...props }) => {
  return <TextareaAutosize className={classNames(s.root, className)} {...props} />;
};

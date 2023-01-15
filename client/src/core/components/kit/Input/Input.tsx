import { InputLabel, TextField, TextFieldProps } from "@mui/material";
import classNames from "classnames";
import React, { FC } from "react";

import s from "./Input.module.scss";

type InputProps = { inputLabel?: string } & TextFieldProps;

export const Input: FC<InputProps> = ({ inputLabel, className, children, ...props }) => {
  return (
    <div>
      {inputLabel && <InputLabel className={s.label}>{inputLabel}</InputLabel>}
      <TextField className={classNames(s.input, className)} variant="outlined" {...props}>
        {children}
      </TextField>
    </div>
  );
};

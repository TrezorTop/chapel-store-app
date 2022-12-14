import { InputLabel, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

import s from "./Input.module.scss";

type InputProps = { inputLabel?: string } & TextFieldProps;

export const Input: FC<InputProps> = ({ inputLabel, ...props }) => {
  return (
    <div>
      {inputLabel && <InputLabel className={s.label}>{inputLabel}</InputLabel>}
      <TextField variant="standard" {...props} />
    </div>
  );
};

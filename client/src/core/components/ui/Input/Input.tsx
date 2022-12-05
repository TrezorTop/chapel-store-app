import { TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

type InputProps = TextFieldProps;

export const Input: FC<InputProps> = ({ ...props }) => {
  return <TextField variant="standard" {...props} />;
};

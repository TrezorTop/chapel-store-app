import { InputLabel } from "@mui/material";
import React, { CSSProperties, FC, ReactNode, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";

import s from "./FileDropzone.module.scss";

const style: CSSProperties = {
  border: "2px dashed #4287f5",
  width: "100%",
  height: "100px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

type TFileDropzoneProps = {
  onChange?: (files: File[]) => void;
  accept?: Accept;
  label?: string;
};

export const FileDropzone: FC<TFileDropzoneProps> = ({ onChange, accept, label }) => {
  const [files, setFiles] = useState<File[]>();

  useEffect(() => {
    onChange && files && onChange(files);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (event) => {
      setFiles(event);
    },
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
    accept: accept,
  });

  return (
    <div {...getRootProps({ style })}>
      {label && <InputLabel className={s.label}>{label}</InputLabel>}
      <input {...getInputProps()} type="file" />
    </div>
  );
};

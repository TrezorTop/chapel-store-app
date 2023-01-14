import React, { FC, ReactNode } from "react";

import s from "./Modal.module.scss";

import { Modal as MuiModal, ModalProps } from "@mui/material";
import { ModalTitle } from "./ModalTitle/ModalTitle";
import { Paper } from "../Paper/Paper";
import { ModalActions } from "./ModalActions/ModalActions";

type TModal = {
  modalTitle?: ReactNode;
  modalActons?: ReactNode;
} & ModalProps;

export const Modal: FC<TModal> = ({ children, modalTitle, modalActons, keepMounted, ...props }) => {
  return (
    <MuiModal {...props}>
      <div className={s.root}>
        <Paper className={s.content}>
          {modalTitle && <ModalTitle>{modalTitle}</ModalTitle>}
          <div>{children}</div>
          {modalActons && <ModalActions>{modalActons}</ModalActions>}
        </Paper>
      </div>
    </MuiModal>
  );
};

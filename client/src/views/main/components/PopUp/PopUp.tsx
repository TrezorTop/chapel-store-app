import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../../core/components/kit/Button/Button";
import { Paper } from "../../../../core/components/kit/Paper/Paper";
import { Typography } from "../../../../core/components/kit/Typography/Typography";
import { ABOUT_URL, FAQ_POPUP_KEY, MAIN_URL } from "../../../../core/utils/consts/consts";
import s from "./PopUp.module.scss";

export const PopUp = () => {
  const [faqChecked, setFaqChecked] = useState<boolean>(!!localStorage.getItem(FAQ_POPUP_KEY));

  if (faqChecked) return <></>;

  const clickHandle = () => {
    localStorage.setItem(FAQ_POPUP_KEY, "checked");
    setFaqChecked(true);
  };

  return (
    <Paper className={s.root}>
      <Typography variant="h5">First Time Here?</Typography>
      <Typography variant="body1">
        You can read the FAQ{" "}
        <Link className={s.link} to={`${MAIN_URL}/${ABOUT_URL}`} onClick={() => clickHandle()}>
          here
        </Link>
      </Typography>
      <Button fullWidth onClick={() => clickHandle()}>
        GOT IT!
      </Button>
    </Paper>
  );
};

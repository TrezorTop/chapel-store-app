import { InputLabel, MenuItem } from "@mui/material";
import { Button } from "../../../../core/components/kit/Button/Button";

import { Input } from "../../../../core/components/kit/Input/Input";
import { Typography } from "../../../../core/components/kit/Typography/Typography";

import s from "./Selector.module.scss";

export const Selector = () => {
  return (
    <div className={s.root}>
      <Input
        value={""}
        inputLabel="Select Car"
        variant="outlined"
        fullWidth
        select
      >
        <MenuItem value={"Test1"}>Test1</MenuItem>
        <MenuItem value={"Test2"}>Test2</MenuItem>
        <MenuItem value={"Test3"}>Test3</MenuItem>
        <MenuItem value={"Test4"}>Test4</MenuItem>
      </Input>

      <Input
        value={""}
        inputLabel="Select Map"
        variant="outlined"
        fullWidth
        select
      >
        <MenuItem value={"Test1"}>Test1</MenuItem>
        <MenuItem value={"Test2"}>Test2</MenuItem>
        <MenuItem value={"Test3"}>Test3</MenuItem>
        <MenuItem value={"Test4"}>Test4</MenuItem>
      </Input>

      <Button variant="contained" size="large" fullWidth>
        Proceed Payment
      </Button>
    </div>
  );
};

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { FC } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import {
  GetAllPromocodesPath,
  GetAllPromocodesResponse,
} from "../../../../../../../shared/endpoints/promocodes/getAllPromocodes";
import { Button } from "../../../../../core/components/kit/Button/Button";
import { getPromocodes } from "../../../../../core/services/main.service";
import {
  CREATOR_URL,
  EDIT_ENTITIES_PROMOCODES_URL,
  EDIT_ENTITIES_URL,
  MAIN_URL,
} from "../../../../../core/utils/consts/urls";

type TRow = GetAllPromocodesResponse["promocodes"][0];

const Row: FC<TRow> = ({ name, softDeleted, discountToUser, earnedStreamer, promocodeStatistics }) => {
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell align="center">
        <Link to={`${MAIN_URL}/${CREATOR_URL}/${EDIT_ENTITIES_URL}/${EDIT_ENTITIES_PROMOCODES_URL}/${name}/edit`}>
          Edit
        </Link>
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{`${discountToUser}%`}</TableCell>
      <TableCell>{`${promocodeStatistics?.reduce(
        (acc, currentValue) => acc + Number(currentValue.savedToUser),
        0,
      )}`}</TableCell>
      <TableCell>{`${earnedStreamer}%`}</TableCell>
      <TableCell>{`${promocodeStatistics?.reduce(
        (acc, currentValue) => acc + Number(currentValue.payToStreamer),
        0,
      )}`}</TableCell>
      <TableCell>{softDeleted && "Deleted"}</TableCell>
    </TableRow>
  );
};

export const Promocodes = () => {
  const { data } = useQuery([GetAllPromocodesPath], getPromocodes);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Promocode</TableCell>
            <TableCell>Discount To User</TableCell>
            <TableCell>Total Discounted To User</TableCell>
            <TableCell>Earned To Streamer</TableCell>
            <TableCell>Total Earned To Streamer</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.promocodes.map((promocode) => (
            <Row
              key={promocode.name}
              name={promocode.name}
              softDeleted={promocode.softDeleted}
              discountToUser={promocode.discountToUser}
              earnedStreamer={promocode.earnedStreamer}
              promocodeStatistics={promocode.promocodeStatistics}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

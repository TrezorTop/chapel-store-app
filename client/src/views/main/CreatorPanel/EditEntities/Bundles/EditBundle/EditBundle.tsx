import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetByIdBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getByIdBundles";
import { UpdateBundlesPath } from "../../../../../../../../shared/endpoints/bundles/updateBundles";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getBundle, getSetups, updateBundle } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const EditBundle = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [configs, setConfigs] = useState<string[]>([]);

  const { id } = useParams<{ id: string }>();

  const { data: getBundleData, refetch } = useQuery([GetByIdBundlesPath], () => getBundle({ id: id ?? "" }), {
    onSuccess: ({ data }) => {
      setName(data.bundle.name);
      setPrice(Number(data.bundle.price));
      setConfigs(data.bundle.configs.map((config) => config.config.id));
    },
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { data: setupsData } = useQuery([GetAllConfigsPath], getSetups);

  const { mutate } = useMutation([UpdateBundlesPath], () => updateBundle({ id: id ?? "", name, price, configs }), {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
      queryClient.invalidateQueries([GetAllConfigsPath]);
    },
  });

  return (
    <Paper>
      <Form>
        <Input value={name} inputLabel={"Bundle Name"} onChange={(event) => setName(event.target.value)} />
        <Input value={price} type="number" inputLabel={"Price"} onChange={(event) => setPrice(+event.target.value)} />
        <Input
          select
          inputLabel={"Setups"}
          SelectProps={{
            value: configs,
            multiple: true,
            onChange: (event) => setConfigs(event.target.value as string[]),
          }}
        >
          {setupsData?.data.configs.map((setup) => (
            <MenuItem key={setup.id} value={setup.id}>
              {setup.title}
            </MenuItem>
          ))}
        </Input>
        <FormActions>
          <Button onClick={() => mutate()}>Update</Button>
        </FormActions>
      </Form>
    </Paper>
  );
};

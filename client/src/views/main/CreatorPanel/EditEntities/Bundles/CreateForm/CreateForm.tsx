import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CreateBundlesPath } from "../../../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createBundle, getSetups } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { GetAllConfigsPath } from "../../../../../../../../shared/endpoints/configs/getAllConfigs";
import { MenuItem } from "@mui/material";

export const CreateForm = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [configs, setConfigs] = useState<string[]>([]);

  const { mutate } = useMutation([CreateBundlesPath], createBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  const { data: setupsData } = useQuery([GetAllConfigsPath], getSetups);

  return (
    <Form>
      <Input inputLabel={"Bundle Name"} onChange={(event) => setName(event.target.value)} />
      <Input type="number" inputLabel={"Price"} onChange={(event) => setPrice(+event.target.value)} />
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
        <Button onClick={() => mutate({ name, price, configs })}>Submit</Button>
      </FormActions>
    </Form>
  );
};

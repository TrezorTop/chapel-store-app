import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CreateBundlesPath } from "../../../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { GetByIdBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getByIdBundles";
import { UpdateBundlesPath } from "../../../../../../../../shared/endpoints/bundles/updateBundles";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { createBundle, getBundle, updateBundle } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const EditBundle = () => {
  const [name, setName] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  const { data: getBundleData, refetch } = useQuery([GetByIdBundlesPath], () => getBundle({ id: id ?? "" }), {
    onSuccess: ({ data }) => setName(data.bundle.name),
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { mutate } = useMutation([UpdateBundlesPath], () => updateBundle({ id: id ?? "", name }), {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  return (
    <Paper>
      <Form>
        <Input value={name} inputLabel={"Bundle Name"} onChange={(event) => setName(event.target.value)} />
        <FormActions>
          <Button onClick={() => mutate()}>Update</Button>
        </FormActions>
      </Form>
    </Paper>
  );
};

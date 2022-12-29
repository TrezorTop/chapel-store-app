import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { CreateBundlesPath } from "../../../../../../../../shared/endpoints/bundles/createBundles";
import { GetAllBundlesPath } from "../../../../../../../../shared/endpoints/bundles/getAllBundles";
import { Form } from "../../../../../../core/components/hoc/Form/Form";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createBundle } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const CreateForm = () => {
  const [name, setName] = useState<string>("");

  const { mutate } = useMutation([CreateBundlesPath], createBundle, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllBundlesPath]);
    },
  });

  return (
    <Form>
      <Input inputLabel={"Bundle Name"} onChange={(event) => setName(event.target.value)} />
      <Button onClick={() => mutate({ name })}>Submit</Button>
    </Form>
  );
};

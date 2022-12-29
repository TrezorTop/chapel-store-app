import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { CreateCarsPath } from "../../../../../../../../shared/endpoints/cars/createCars";
import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { Form } from "../../../../../../core/components/hoc/Form/Form";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { createCar } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const CreateForm = () => {
  const [name, setName] = useState<string>("");

  const { mutate } = useMutation([CreateCarsPath], createCar, {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllCarsPath]);
    },
  });

  return (
    <Form>
      <Input inputLabel={"Car Name"} onChange={(event) => setName(event.target.value)} />
      <Button onClick={() => mutate({ name })}>Submit</Button>
    </Form>
  );
};

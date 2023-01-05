import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { GetAllCarsPath } from "../../../../../../../../shared/endpoints/cars/getAllCars";
import { GetByIdCarsPath } from "../../../../../../../../shared/endpoints/cars/getByIdCars";
import { UpdateCarsPath } from "../../../../../../../../shared/endpoints/cars/updateCars";
import { Button } from "../../../../../../core/components/kit/Button/Button";
import { Form } from "../../../../../../core/components/kit/Form/Form";
import { FormActions } from "../../../../../../core/components/kit/Form/FormActions/FormActions";
import { Input } from "../../../../../../core/components/kit/Input/Input";
import { Paper } from "../../../../../../core/components/kit/Paper/Paper";
import { getCar, updateCar } from "../../../../../../core/services/main.service";
import { queryClient } from "../../../../../../main";

export const EditCar = () => {
  const [name, setName] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  const { data: getCarData, refetch } = useQuery([GetByIdCarsPath], () => getCar({ id: id ?? "" }), {
    onSuccess: ({ data }) => setName(data.car.name),
  });

  useEffect(() => {
    refetch();
  }, [id]);

  const { mutate } = useMutation([UpdateCarsPath], () => updateCar({ id: id ?? "", name }), {
    onSuccess: () => {
      queryClient.invalidateQueries([GetAllCarsPath]);
    },
  });

  return (
    <Paper>
      <Form>
        <Input value={name} inputLabel={"Car Name"} onChange={(event) => setName(event.target.value)} />
        <FormActions>
          <Button onClick={() => mutate()}>Update</Button>
        </FormActions>
      </Form>
    </Paper>
  );
};

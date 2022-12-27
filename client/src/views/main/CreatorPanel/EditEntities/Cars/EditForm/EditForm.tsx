import React, { FC } from "react";
import { Form } from "../../../../../../core/components/hoc/Form/Form";

import { Input } from "../../../../../../core/components/kit/Input/Input";

type TEditForm = {};

export const EditForm: FC = () => {
  return (
    <Form>
      <Input />
      <Input />
      <Input />
    </Form>
  );
};

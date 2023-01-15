import React, { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../../../core/components/kit/Button/Button";
import { Form } from "../../../core/components/kit/Form/Form";
import { FormActions } from "../../../core/components/kit/Form/FormActions/FormActions";
import { SIGN_IN_URL, SIGN_UP_URL } from "../../../core/utils/consts/urls";
import { Window } from "../components/Window/Window";
import { Confirm } from "./Confirm/Confirm";
import { Email } from "./Email/Email";

enum Step {
  Email,
  Confirm,
}

export const Restore = () => {
  const [step, setStep] = useState<Step>(Step.Email);
  const navigate = useNavigate();

  return (
    <Window header="Password Restoration">
      <Form>
        {step === Step.Email && (
          <Email
            onSubmit={() => {
              setStep(Step.Confirm);
            }}
          />
        )}
        {step === Step.Confirm && <Confirm />}
        <FormActions variant="vertical">
          <Button variant="text" onClick={() => navigate(`../${SIGN_IN_URL}`)}>
            Sign In
          </Button>
        </FormActions>
      </Form>
    </Window>
  );
};

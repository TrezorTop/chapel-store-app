import { Divider } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { PROFILE_URL } from "../../../core/utils/consts/urls";

import s from "./About.module.scss";

export const About = () => {
  return (
    <div className={s.root}>
      <div>
        <section>
          <Typography variant="h4" marginBottom>
            FAQ
          </Typography>
          <Divider />

          <div>
            <Typography color="primary" variant="h5">
              How to get the product?
            </Typography>
            <Typography variant="body1">
              This is downloadable content, after purchase, you will have access to the product in your{" "}
              <NavLink to={`../${PROFILE_URL}`}>profile</NavLink>.
            </Typography>
            <Typography variant="body1">
              Please note that you will not be able to make a purchase without authorization.
            </Typography>
          </div>

          <div>
            <Typography color="primary" variant="h5">
              Why do I need to be authorized?
            </Typography>
            <Typography variant="body1">
              We store your purchase so you can always access the latest version of product.
            </Typography>
          </div>
        </section>
      </div>

      <Divider className={s.divider} orientation="vertical" flexItem />

      <div>
        <section>
          <Typography variant="h4">General Info</Typography>
          <Divider />

          <div>
            <Typography color="primary" variant="h5">
              Full name of the owner
            </Typography>
            <Typography variant="body1">Mikhail Statsenko</Typography>
          </div>

          <div>
            <Typography color="primary" variant="h5">
              TIN (Taxpayer Identification Number)
            </Typography>
            <Typography variant="body1">165609874502</Typography>
          </div>

          <div>
            <Typography color="primary" variant="h5">
              Contact Email
            </Typography>
            <Typography variant="body1">
              <a href="mailto:trechofficial@gmail.com">trechofficial@gmail.com</a>
            </Typography>
          </div>
        </section>
      </div>
    </div>
  );
};

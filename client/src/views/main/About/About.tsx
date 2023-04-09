import { Divider } from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Typography } from "../../../core/components/kit/Typography/Typography";
import { PROFILE_URL } from "../../../core/utils/consts/consts";

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
              Project information
            </Typography>
            <Typography variant="body1">
              MS-Setups is a virtual cars setup store in the car simulation game Assetto Corsa Competizione.
            </Typography>
            <Typography variant="body1">
              Each Bundle includes a set of setups for several tracks, the list of which is visible when you select it.
              Additional information about the products is available in the store's{" "}
              <a className={s.link} href={"https://discord.gg/AzvqMC9tgq"} target="_blank">
                Discord server.
              </a>
            </Typography>
          </div>

          <div>
            <Typography color="primary" variant="h5">
              How to get the product?
            </Typography>
            <Typography variant="body1">
              Content is downloadable after purchase, you will have access to the product in your profile.{" "}
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

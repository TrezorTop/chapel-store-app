import { Typography as MuiTypography, TypographyProps } from "@mui/material";
import { FC, ReactNode } from "react";

type Typography = {
  marginBottom?: boolean;
} & Omit<TypographyProps, "marginBottom">;

export const Typography: FC<Typography> = ({ children, marginBottom, variant, ...props }) => {
  return (
    <MuiTypography
      marginBottom={() => {
        if (!marginBottom) return undefined;

        switch (variant) {
          case "h1":
            return "54px";
          case "h2":
            return "46px";
          case "h3":
            return "38px";
          case "h4":
            return "30px";
          case "h5":
            return "22px";
          case "h6":
            return "14px";
          default:
            return undefined;
        }
      }}
      variant={variant}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};
